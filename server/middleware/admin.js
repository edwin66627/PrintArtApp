module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next() //If user is admin then they have access to the route
    } else {
        return res
            .set(403).send({ message: 'Only admin users can take this action' })
    }
}