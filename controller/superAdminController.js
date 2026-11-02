const adminModels = require("../model/superAdminModel");

const listRegisteredRestaurant = async(req, res)=>{
    try {
        const restaurantes = await adminModels.selectRegisteredRestaurant();

        if(!restaurantes || restaurantes.length === 0){
            return res.status(400).json({erro: "Sem restaurantes registados."});
        }

        return res.status(200).json({mensagem: restaurantes});
    } catch (error) {
        console.error("Falha ao listar: ", error);
        return res.status(500).json({erro: "Falha no servidor. Tente mais tarde!"});
    }
}

const countRegisteredRestaurants = async(req, res)=>{
    try {
        const restaurantes = await adminModels.selectRegisteredRestaurant();
        const registeredCount = restaurantes.length - 1;

        if(registeredCount < 0){
            return res.status(400).json({erro: `Problemas na contagem: ${registeredCount}!`});
        }

        return res.status(200).json({mensagem: registeredCount});
    } catch (error) {
        console.error("Falha ao contar: ", error);
        return res.status(500).json({erro: "Falha no servidor. Tente mais tarde!"});
    }
}

module.exports = {
    listRegisteredRestaurant,
    countRegisteredRestaurants
}