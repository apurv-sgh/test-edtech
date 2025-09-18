const Student = require('../models/Student');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get featured teachers (high-rated teachers with courses)
// @route   GET /api/teachers/featured
// @access  Public
const getFeaturedTeachers = asyncHandler(async (req, res) => {
    try {
        // Get teachers who have courses and calculate their ratings
        const teachersWithCourses = await Course.aggregate([
            {
                $group: {
                    _id: '$teacher',
                    totalCourses: { $sum: 1 },
                    totalStudents: { $sum: { $size: '$studentsEnrolled' } },
                    averageRating: { $avg: '$rating.average' },
                    totalRating: { $sum: '$rating.count' }
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'teacherInfo'
                }
            },
            {
                $unwind: '$teacherInfo'
            },
            {
                $match: {
                    'teacherInfo.userType': 'Teacher',
                    totalCourses: { $gte: 1 },
                    averageRating: { $gte: 4.0 } // Only high-rated teachers
                }
            },
            {
                $project: {
                    _id: '$_id',
                    name: '$teacherInfo.name',
                    email: '$teacherInfo.email',
                    profilePicture: '$teacherInfo.profilePicture',
                    totalCourses: 1,
                    totalStudents: 1,
                    averageRating: { $round: ['$averageRating', 1] },
                    totalRating: 1
                }
            },
            {
                $sort: { averageRating: -1, totalStudents: -1 }
            },
            {
                $limit: 8 // Limit to 8 featured teachers
            }
        ]);

        res.json({
            success: true,
            data: teachersWithCourses
        });
    } catch (error) {
        console.error('Error fetching featured teachers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured teachers'
        });
    }
});

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getAllTeachers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 12, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery = {
            userType: 'Teacher',
            isActive: true
        };

        if (search) {
            searchQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get teachers with course statistics
        const teachersWithStats = await Student.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'teacher',
                    as: 'courses'
                }
            },
            {
                $addFields: {
                    totalCourses: { $size: '$courses' },
                    totalStudents: {
                        $sum: {
                            $map: {
                                input: '$courses',
                                as: 'course',
                                in: { $size: '$$course.studentsEnrolled' }
                            }
                        }
                    },
                    averageRating: {
                        $avg: {
                            $map: {
                                input: '$courses',
                                as: 'course',
                                in: '$$course.rating.average'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profilePicture: 1,
                    totalCourses: 1,
                    totalStudents: 1,
                    averageRating: { $round: ['$averageRating', 1] },
                    createdAt: 1
                }
            },
            {
                $sort: { averageRating: -1, totalStudents: -1, createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Get total count for pagination
        const totalTeachers = await Student.countDocuments(searchQuery);

        res.json({
            success: true,
            data: teachersWithStats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTeachers / limit),
                totalTeachers,
                hasNext: skip + teachersWithStats.length < totalTeachers,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teachers'
        });
    }
});

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Public
const getTeacherById = asyncHandler(async (req, res) => {
    try {
        const teacher = await Student.findOne({
            _id: req.params.id,
            userType: 'Teacher',
            isActive: true
        }).select('-password -__v');

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Get teacher's course statistics
        const courseStats = await Course.aggregate([
            {
                $match: { teacher: teacher._id }
            },
            {
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    totalStudents: { $sum: { $size: '$studentsEnrolled' } },
                    averageRating: { $avg: '$rating.average' },
                    totalRating: { $sum: '$rating.count' }
                }
            }
        ]);

        const stats = courseStats[0] || {
            totalCourses: 0,
            totalStudents: 0,
            averageRating: 0,
            totalRating: 0
        };

        res.json({
            success: true,
            data: {
                ...teacher.toObject(),
                stats: {
                    totalCourses: stats.totalCourses,
                    totalStudents: stats.totalStudents,
                    averageRating: Math.round(stats.averageRating * 10) / 10,
                    totalRating: stats.totalRating
                }
            }
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teacher'
        });
    }
});

// @desc    Get teacher's courses
// @route   GET /api/teachers/:id/courses
// @access  Public
const getTeacherCourses = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        // Verify teacher exists
        const teacher = await Student.findOne({
            _id: req.params.id,
            userType: 'Teacher',
            isActive: true
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Get teacher's courses
        const courses = await Course.find({ teacher: req.params.id })
            .select('-lessons -studentsEnrolled')
            .populate('teacher', 'name email profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalCourses = await Course.countDocuments({ teacher: req.params.id });

        res.json({
            success: true,
            data: courses,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses,
                hasNext: skip + courses.length < totalCourses,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching teacher courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teacher courses'
        });
    }
});

module.exports = {
    getFeaturedTeachers,
    getAllTeachers,
    getTeacherById,
    getTeacherCourses
};
