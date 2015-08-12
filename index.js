'use strict';

module.exports = function promiseSeq(args, promiseFn){

  return new Promise(function(res, rej){

    // check arguments
    if(!Array.isArray(args)){
      throw Error('args is not an Array');
    }
    if(typeof promiseFn !== 'function'){
      throw Error('promiseFn is not a function');
    }

    var results = [];

    var gen = (function*(){

      for(let arg of args){

        yield promiseFn(arg)
        .then(function(result){
          results.push(result);
          gen.next();
        })
        .catch(function(err){
          rej(err);
        });
      }

      res(results);
      return true;
    })();

    gen.next();
  });
};

