// (C) 2016 Philip Løventoft

function syncer()
{
  var state = {};
  state.p = Q("");

  var checkpoint = function(f)
  {
    return function(p1, p2, p3, p4, p5, p6, p7)
    {
      var f1 = f;

      state.p = state.p
      .catch(function()
      {
        return;
      }) //Suck up unhandled errors
      .then(function()
      {
        return f1(p1, p2, p3, p4, p5, p6, p7);
      });
      return state.p;
    }
  }

  return {
    checkpoint: checkpoint
  };
}
