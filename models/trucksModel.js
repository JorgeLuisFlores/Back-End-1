const db = require('../database/dbConfig.js');
const atob = require('atob');
module.exports = {
    getTrucks,
    trucksOwned,
    findTruckById,
    insertTruck,
    remove,
    update
};

function findOperatorId(token){
    const [,payload] = token.split('.')
    const [,,,id] =atob(payload).split(':')
    const [realId] =id.split(',')
    console.log(realId)

    return realId
}

function getTrucks(){
     return db('trucks').limit(10);
}

function trucksOwned(token){

   const id = findOperatorId(token)
    
   return db('trucks as t')
   .where('t.operator_id', '=', id);
}

function findTruckById(id){
    return db('trucks')
        .select(
            'id',
            'name',
            'operator_id',
            'imgUrl',
            'cuisineType'
        ).where({ id }).first();
}

async function insertTruck(truck){
    const [id] = await db('trucks').insert(truck);

    return findTruckById(id);
}

function remove(name, token) {
   const id = findOperatorId(token);

    return db('trucks').where(('operator_id', '=', id) && name).del();
}

function update(changes, token){
    const id = findOperatorId(token);
    console.log(changes.id)

    return db('trucks').where(changes.id && ('operator_id', '=', id)).update(changes)
}