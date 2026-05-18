import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';
import { CustomError } from '../utils/CustomError';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private (Admin/Sales)
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    const lead = await Lead.create(validatedData);

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (with pagination, filtering, search, sorting)
// @route   GET /api/leads
// @access  Private (Admin/Sales)
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', search, status, source, sort = 'latest' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build Query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    // Build Sort
    let sortConfig: any = { createdAt: -1 }; // default latest
    if (sort === 'oldest') {
      sortConfig = { createdAt: 1 };
    }

    const leads = await Lead.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private (Admin/Sales)
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new CustomError('Lead not found', 404);
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private (Admin/Sales)
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateLeadSchema.parse(req.body);

    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new CustomError('Lead not found', 404);
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new CustomError('Lead not found', 404);
    }

    await lead.deleteOne();

    res.json({
      success: true,
      message: 'Lead removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private (Admin only)
export const exportLeadsCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, source } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (source) query.source = source;

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    const csvRows = [];
    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
    csvRows.push(headers.join(','));

    for (const lead of leads) {
      const row = [
        lead._id,
        `"${lead.name.replace(/"/g, '""')}"`, // escape quotes
        `"${lead.email}"`,
        lead.status,
        lead.source,
        lead.createdAt.toISOString(),
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};
