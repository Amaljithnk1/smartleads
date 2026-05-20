import { Response, NextFunction } from 'express';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { AuthRequest, ApiResponse, LeadFilters, LeadStatus, LeadSource } from '../types';
import { AppError } from '../middleware/errorHandler';

const buildQuery = (filters: LeadFilters, userId: string, role: string) => {
  const query: Record<string, unknown> = {};

  if (role !== 'admin') query.createdBy = userId;
  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;
  if (filters.search) {
    const regex = new RegExp(filters.search, 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

export const getLeads = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status, source, search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const filters: LeadFilters = {
      status: status as LeadStatus,
      source: source as LeadSource,
      search,
      sort: sort as 'latest' | 'oldest',
      page: Math.max(1, parseInt(page, 10)),
      limit: Math.min(50, Math.max(1, parseInt(limit, 10))),
    };

    const query = buildQuery(filters, req.user!.id, req.user!.role);
    const sortOrder = filters.sort === 'oldest' ? 1 : -1;
    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(filters.limit ?? 10)
        .lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / (filters.limit ?? 10));

    res.status(200).json({
      success: true,
      data: { leads },
      meta: {
        total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        totalPages,
        hasNextPage: (filters.page ?? 1) < totalPages,
        hasPrevPage: (filters.page ?? 1) > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) throw new AppError('Lead not found', 404);

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json({ success: true, data: { lead } });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body as {
      name: string; email: string; status?: LeadStatus; source: LeadSource; notes?: string;
    };

    const lead = await Lead.create({
      name, email, status: status ?? 'New', source, notes,
      createdBy: req.user!.id,
    });

    await lead.populate('createdBy', 'name email');

    res.status(201).json({ success: true, message: 'Lead created successfully.', data: { lead } });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Lead updated successfully.', data: { lead: updated } });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = buildQuery({}, req.user!.id, req.user!.role);
    const leads = await Lead.find(query).populate('createdBy', 'name').lean();

    const fields = ['name', 'email', 'status', 'source', 'notes', 'createdAt'];
    const data = leads.map((l) => ({
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      notes: l.notes ?? '',
      createdAt: new Date(l.createdAt).toLocaleDateString(),
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};

export const getLeadStats = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const matchStage = req.user!.role === 'admin'
      ? {}
      : { createdBy: req.user!.id };

    const stats = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Lead.countDocuments(matchStage);
    const byStatus = Object.fromEntries(stats.map((s) => [s._id, s.count]));

    res.status(200).json({
      success: true,
      data: {
        total,
        new: byStatus['New'] ?? 0,
        contacted: byStatus['Contacted'] ?? 0,
        qualified: byStatus['Qualified'] ?? 0,
        lost: byStatus['Lost'] ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
