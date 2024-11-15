// Middleware to check if the user is logged in
export function checkLoggedIn(req, res, next) {
    
    if (req.session.loggedIn) {
        return next();
    } else {
        res.redirect('/login/');
    }
}




export function isAdminById(req, res, next){
    /*let sql = db.prepare('SELECT isAdmin FROM user WHERE id = ?');
    console.log('denne', req.session.userId)
    let rows = sql.all(req.session.userId)
    console.log(rows[0].isAdmin + " isAdmin?")*/
    
    if (req.session.role == 'Administrator') {
        return next();
        
    } else {
        return res.redirect('/student/');
    }
    
}