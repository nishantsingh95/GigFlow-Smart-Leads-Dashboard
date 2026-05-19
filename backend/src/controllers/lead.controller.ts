import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Lead, ILead } from '../models/Lead';
import { AuthRequest, LeadSource, LeadStatus, PaginationMeta } from '../types';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { leadsToCSV } from '../utils/csv';
import { sendSuccess } from '../utils/response';

const PAGE_LIMIT = 10;

const buildLeadFilter = (query: {
  status?: string;
  source?: string;
  search?: string;
}): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (query.status) {
    filter.status = query.status as LeadStatus;
  }

  if (query.source) {
    filter.source = query.source as LeadSource;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const buildPaginationMeta = (
  totalRecords: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  return {
    currentPage: page,
    totalPages,
    totalRecords,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const createLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.userId,
    });

    await lead.populate('createdBy', 'name email');

    sendSuccess(res, 201, 'Lead created successfully', { lead });
  }
);

export const getLeads = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page: pageQuery,
    } = req.query as {
      status?: string;
      source?: string;
      search?: string;
      sort?: 'latest' | 'oldest';
      page?: string;
    };

    const page = Math.max(1, parseInt(pageQuery || '1', 10));
    const limit = PAGE_LIMIT;
    const skip = (page - 1) * limit;

    const filter = buildLeadFilter({ status, source, search });
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const pagination = buildPaginationMeta(totalRecords, page, limit);

    sendSuccess(res, 200, 'Leads retrieved successfully', { leads }, pagination);
  }
);

export const getLeadById = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    sendSuccess(res, 200, 'Lead retrieved successfully', { lead });
  }
);

export const updateLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    sendSuccess(res, 200, 'Lead updated successfully', { lead });
  }
);

export const deleteLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    sendSuccess(res, 200, 'Lead deleted successfully');
  }
);

export const exportLeadsCSV = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { status, source, search, sort = 'latest' } = req.query as {
      status?: string;
      source?: string;
      search?: string;
      sort?: 'latest' | 'oldest';
    };

    const filter = buildLeadFilter({ status, source, search });
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const leads = await Lead.find(filter).sort({ createdAt: sortOrder });

    const csv = leadsToCSV(leads);
    const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  }
);
