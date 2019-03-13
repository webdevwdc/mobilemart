const passport = require("passport");
const passportJWT = require("passport-jwt");
const users = require('user/models/user.model');
const cfg = require("./config.js");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('token')
};
const accessCheck = require("./accesscheck.js");

module.exports = () => {
    const strategy = new Strategy(params, (payload, done) => {
        users.findById(payload.id).populate({
            'path': 'role',
            'select': 'role title'
        }).exec((err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: (req, res, next) => {
            passport.authenticate("jwt", cfg.jwtSession, async (err, user, info) => {
                if (err) { return next(err); }
                if (!user) { return res.redirect('/') }
                if (user) {
                    req.user = user;

                    // For page permission check //
                    var getRouteInfo = utils.menuAccess(routeList, req.path);
                    var currentRoute = '';
                    if (_.isArray(getRouteInfo)) {
                        currentRoute = getRouteInfo[0];
                        if (req.user.role.role == 'admin' || currentRoute == 'user.dashboard' || currentRoute == 'user.myprofile' || currentRoute == 'user.profileupdate' || currentRoute == 'user.changepassword' || currentRoute == 'user.updatepassword') {
                            return next();
                        } else {
                            const isAccess = await accessCheck.findIsAccess(req.user.role._id, currentRoute);
                            if (isAccess) {
                                return next();
                            } else {
                                res.render('permission.ejs', {
                                    page_name: 'Permission',
                                    page_title: 'Permission',
                                    user: req.user,
                                    response: "",
                                });
                            }
                        }
                    } else {
                        return res.redirect('/');
                    }

                } else {
                    return res.redirect('/');
                }

            })(req, res, next);
        },
        // This is for webservice jwt token check //
        authenticateAPI: (req, res, next) => {
            // check for nonsecure path like login //
            const nonSecurePaths = cfg.nonSecurePaths;
            if (_.contains(nonSecurePaths, req.path)) return next();
            // check for nonsecure path like login //
            passport.authenticate("jwt", cfg.jwtSession, (err, user) => {
                if (err) { res.send({ status: 500, auth: false, message: 'Failed to authenticate token.' }); }
                if (!user) { res.send({ status: 500, auth: false, message: "There was a problem finding the user." }); }
                if (user) {
                    req.user = user;
                    return next();
                }
            })(req, res, next);
        }
    };
};

