import LocalForage from '../node_modules/localforage/dist/localforage.js'
import Q from '../node_modules/q/q.js'
import _ from '../node_modules/underscore/underscore.js'

export class PersistentList {

  constructor(id)
  {
    this.id = id;
    this.counter = 0;
    this.indexId = this.id+ "_index";
    this.getIndex = () => {
      return LocalForage.getItem(this.indexId);
    }
  }

  init()
  {
    return this.getIndex()
    .then((index) => {
      if (!index)
      {
        return LocalForage.setItem(this.indexId, []);
      }
      else if (index.length > 0)
      {
        this.counter = _.max(index)+1;
      }
    });
  }


  insert(item)
  {
    return this.getIndex()
    .then((index) =>
    {
      var id = ++this.counter; //Pre-increment! OMG

      //Transmutation - or whatever to call it -
      // this promise sort of assumes the identity of the enclosing one
      return Q.all(
        LocalForage.setItem(this.indexId, index.concat([id])), //Insert id into index
        LocalForage.setItem(id, item)); //Insert item
    });
  }

  get()
  {

  }

  remove()
  {

  }

  getAll()
  {
    return this.init().then(this.getIndex)
    .then((index) =>
      {
        if (index.length > 0)
          return Q.all(
             _.map(index, (id) => LocalForage.getItem(id))
           );
        else
            return [];
      }
    );
  }
}
