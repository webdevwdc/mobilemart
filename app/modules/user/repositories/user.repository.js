const mongoose = require('mongoose');
const User = require('user/models/user.model');
const rolePermission = require('permission/models/role_permission.model');
const perPage = config.PAGINATION_PERPAGE;

class UserRepository {
    constructor() { }

    async fineOneWithRole(params) {
        try {
            const user = await User.findOne({
                email: params.email,
                isDeleted: false,
                // isActive: true
                status: 'Active'
            }).populate('role').exec();
            if (!user) {
                return new Error('Authentication failed. User not found.');
            } else if (user) {
                if (!user.validPassword(params.password, user.password)) {
                    return new Error('Authentication failed. Wrong password.');
                } else {
                    return user;
                }
            }
        } catch (error) {
            return error;
        }
    }

    async findIsAccess(user_role, permission_id) {
        try {
            let roleInfo = await rolePermission.findOne({ $and: [{ 'role': user_role }, { 'permissionall': { $in: [permission_id] } }] }).exec();
            let is_access = (roleInfo != null) ? true : false;
            throw is_access
        } catch (e) {
            return e;
        }
    }

    async getAll(_searchQuery, user, sortOrder, page) {
        try {
            const query = [{
                "isDeleted": false,
                _id: {
                    $ne: mongoose.Types.ObjectId(user._id)
                },
                'user_role.role': {
                    $nin: ["admin", "sub-admin"]
                }
            }];
            // serach by keyword
            if (_.has(_searchQuery, "keyword")) {
                if (_searchQuery.keyword != '') {
                    const search = _searchQuery.keyword.trim();
                    query.push({
                        "$or": [{
                            'first_name': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'last_name': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'email': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'document.phone': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        }
                        ]
                    });
                }
            }

            // serach by role
            if (_.has(_searchQuery, "role")) {
                if (_searchQuery.role != '') {
                    query.push({
                        'role': mongoose.Types.ObjectId(_searchQuery.role)
                    });
                }
            }

            const searchQuery = {
                "$and": query
            };
            const aggregate = User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$sort": sortOrder
            },
            {
                $project: {
                    first_name: "$first_name",
                    last_name: "$last_name",
                    email: "$email",
                    phone: "$phone",
                    role: "$role",
                    isDeleted: "$isDeleted",
                    user_role: "$user_role",
                    document: "$$ROOT"
                }
            },
            {
                $match: searchQuery
            },
            ]);
            return await User.aggregatePaginate(aggregate, {
                page: page,
                limit: perPage
            });
        } catch (error) {
            return error;
        }
    }

    async getAllUsers(_searchQuery = {}) {

        try {
            const query = [{
                "isDeleted": false,
                'user_role.role': {
                    $nin: ["admin"]
                }
            }];



            const searchQuery = {
                "$and": query
            };
            const aggregate = await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                $project: {
                    first_name: "$first_name",
                    last_name: "$last_name",
                    email: "$email",
                    phone: "$phone",
                    role: "$role",
                    isDeleted: "$isDeleted",
                    user_role: "$user_role",
                    document: "$$ROOT"
                }
            },
            {
                $match: searchQuery
            },
            ]);
            // console.log('11',aggregate)
            return aggregate;
        } catch (error) {
            return error;
        }
    }

    async getAllUsersByRolename(_searchQuery, user, sortOrder = {
        _id: -1
    }, page, rolename) {
        try {
            // const query = [{ "isDeleted": false, _id: { $ne: mongoose.Types.ObjectId(user._id) }, 'user_role.role': { $nin: ["admin", "sub-admin"] } }];
            let query = [{
                "isDeleted": false,
                _id: {
                    $ne: mongoose.Types.ObjectId(user._id)
                },
                'user_role.role': rolename
            }];
            // serach by keyword //

            if (_.has(_searchQuery, "keyword")) {
                if (_searchQuery.keyword != '') {
                    let search = _searchQuery.keyword.trim();
                    query.push({
                        "$or": [{
                            'first_name': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'last_name': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'email': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        },
                        {
                            'document.phone': {
                                '$regex': search,
                                '$options': 'i'
                            }
                        }
                        ]
                    });
                }
            }

            // serach by role //
            if (_.has(_searchQuery, "role")) {
                if (_searchQuery.role != '') {
                    query.push({
                        'role': mongoose.Types.ObjectId(_searchQuery.role)
                    });
                }
            }

            const searchQuery = {
                "$and": query
            };

            let aggregate = User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                $match: searchQuery
            },
            {
                "$sort": sortOrder
            },
            {
                $project: {
                    first_name: "$first_name",
                    last_name: "$last_name",
                    email: "$email",
                    phone: "$phone",
                    role: "$role",
                    isDeleted: "$isDeleted",
                    user_role: "$user_role",
                    document: "$$ROOT"
                }
            }
            ]);

            let options = {
                page: page,
                limit: perPage
            };
            return await User.aggregatePaginate(aggregate, options);
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            return await User.findById(id).populate('role').lean().exec();
        } catch (error) {
            return error;
        }
    }

    async getByField(params) {
        try {
            return await User.findOne(params).exec();
        } catch (error) {
            return error;
        }
    }

    async getAllByField(params) {
        try {
            return await User.find(params).exec();
        } catch (error) {
            return error;
        }
    }

    // async getAllPassengerByField(params) {
    //     try {
    //         return await User.find(params).exec();
    //     } catch (error) {
    //         return error;
    //     }
    // }

    async getUserCount() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "user_role.role": 'rider',
                }
            },
            {
                $group: {
                    _id: "$_id",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                "$sort": {
                    _id: 1
                }
            },
            ]);
        } catch (error) {
            return error;
        }
    }

    async getDriver() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "isDeleted": false,
                    "user_role.role": 'driver',
                }
            },
            {
                "$sort": {
                    _id: 1
                }
            },

            ]);
        } catch (error) {
            return error;
        }
    }


    async getPassenger() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "isDeleted": false,
                    "user_role.role": 'rider',
                }
            },
            {
                "$sort": {
                    _id: 1
                }
            },
            ]).exec();
        } catch (error) {
            return error;
        }
    }

    async getDriverCount() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "isDeleted": false,
                    "user_role.role": 'driver',
                }
            },
            {
                $group: {
                    _id: '$_id',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                "$sort": {
                    _id: 1
                }
            },

            ]);
        } catch (error) {
            return error;
        }
    }

    async getPassengerCount() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "isDeleted": false,
                    "user_role.role": 'rider',
                }
            },
            {
                $group: {
                    _id: null,
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                "$sort": {
                    _id: 1
                }
            },
            ]).exec();
        } catch (error) {
            return error;
        }
    }

    async getSubAdminCount() {
        try {
            return await User.aggregate([{
                $unwind: "$role"
            },
            {
                "$lookup": {
                    "from": "roles",
                    "localField": "role",
                    "foreignField": "_id",
                    "as": "user_role"
                },
            },
            {
                $unwind: "$user_role"
            },
            {
                "$match": {
                    "isDeleted": false,
                    "user_role.role": "sub_admin"
                }
            },
            ]).exec();
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await User.findById(id).exec();
            return await User.findByIdAndUpdate(id, {
                isDeleted: true
            }).exec();
        } catch (error) {
            return error;
        }
    }

    async updateById(data, id) {
        try {
            return await User.findByIdAndUpdate(id, data, {
                new: true,
                upsert: true
            }).populate('role').exec();
        } catch (error) {
            return error;
        }
    }

    async save(data) {
        try {
            const _save = new User(data);
            return await _save.save();
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(params) {
        try {
            const user = await User.findOne({
                email: params.email_p_c
            }).exec();
            if (!user) {
                throw new Error('Authentication failed. User not found.');
            } else {
                let random_pass = Math.random().toString(36).substr(2, 9);
                const readable_pass = random_pass;
                random_pass = user.generateHash(random_pass);
                await User.findByIdAndUpdate(user._id, {
                    password: random_pass
                }).exec();
                return readable_pass;
            }
        } catch (error) {
            throw error;
        }
    }

    async getUser(id) {
        try {
            return await User.findOne({
                id
            }).exec();
        } catch (error) {
            return error;
        }
    }
}

module.exports = new UserRepository();