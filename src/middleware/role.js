function roleMiddleware(role) {

    return (req, res, next) => {

        if(req.user.role !== role){
            return res.status(403).json({
                mensagem: "Sem permissão"
            });
        }


        // se tiver permissão:
        next();
    };
}

module.exports = roleMiddleware;