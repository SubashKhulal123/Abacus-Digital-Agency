const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const Notification = require('../../models/Notification.model');

const list = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({}).sort('-createdAt').limit(30);
  const unreadCount = await Notification.countDocuments({ isRead: false });
  return new ApiResponse(200, notifications, 'Notifications fetched', { unreadCount }).send(res);
});

const markRead = asyncHandler(async (req, res) => {
  const doc = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!doc) throw ApiError.notFound('Notification not found');
  return new ApiResponse(200, doc, 'Notification marked as read').send(res);
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  return new ApiResponse(200, null, 'All notifications marked as read').send(res);
});

module.exports = { list, markRead, markAllRead };
