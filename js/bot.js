
var bot = function(){
    var best = Number.MAX_VALUE;
    var availFromBest = 0;
    var move = 0;
    for(var i=0; i<4; i++)
    {
        //var sceneSmallest = runScenerios(gm, i); //up
        var scene = runScenerio(gm, i);
        var sceneAvailable = scene.grid.availableCells().length
        var sceneDiff = recursive_diffs(scene, i, 0);
        if(sceneDiff < best && scene.moved)
        {
            move = i;
            best = sceneDiff;
            availFromBest = sceneAvailable;
        }
        else if(sceneDiff == best && scene.moved && sceneAvailable>availFromBest)
        {
            move = i;
            best = sceneDiff;
            availFromBest = sceneAvailable;
        }

    }
    gm.move(move);
    if(!gm.won)
        setTimeout(bot, 50);
};

var recursive_diffs = function(gm, dir, counter)
{
    counter++;
    var distance = computeDifferences(gm);
    var scene = runScenerio(gm, dir);
    if(counter < 3 && scene.movesAvailable())
    {
        var cells = scene.grid.availableCells();
         var pathCount = 1;
        for(var j=0; j<cells.length; j++)
        {
            var bestOfSet = Number.MAX_VALUE;

            for(var i=0; i<4; i++)
            {
                 var be = new botEngine(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                 be.grid = new Grid(scene.grid.size, scene.grid.serialize().cells);
                 var tile = new Tile(cells[j], 2);
                 be.grid.insertTile(tile);
                 var bFour = new botEngine(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
                  bFour.grid = new Grid(scene.grid.size, scene.grid.serialize().cells);
                  tile = new Tile(cells[j], 4);
                  bFour.grid.insertTile(tile);
                 if(runScenerio(be, i).moved)
                 {
                     var s_diffTwo = 0.9*recursive_diffs(be, i, counter);
                     var s_diffFour= 0.1*recursive_diffs(bFour, i, counter);
                     var s_diff = s_diffTwo+s_diffFour;
                     if(s_diff<bestOfSet)
                     {
                        pathCount++;
                        bestOfSet = s_diff;
                     }
                     if(s_diff<1)
                     {
                        var k=0;
                     }
                 }
                 delete be;
                 delete bFour;
            }
            distance += bestOfSet;
        }
        distance = distance/pathCount; //average of paths
        delete cells;
    }
    else if(!scene.movesAvailable())
        distance = 5000;
    else if(counter >=3)
    {
      var avail = scene.grid.availableCells().length;
      if(avail < 6)
      {
        distance *= (6-avail);
      }
    }
    delete scene;
    return distance;
};

var runScenerios = function(gm, dir){
    var scene = runScenerio(gm, dir);
    var score = scene.score;
    var smallest = 0;
    if(scene.moved)
    {
        for(var i=0; i<4; i++)
        {
            var sSmallest = runScenerios(scene, i);
            if(sSmallest > smallest)
                smallest = sSmallest;
        }
        return smallest; //return the least small scenerio (best case)
    }
    else
    {
        return getSmallest(scene); //return actual smallest value
    }
};

var getSmallest = function(scene){
        var tile;
        smallest = 9999;
        for (var x = 0; x < scene.size; x++) {
            for (var y = 0; y < scene.size; y++) {
              tile = scene.grid.cellContent({ x: x, y: y });
              if (tile) {
                if(tile.value < smallest)
                    smallest = tile.value;
              }
            }
          }

        return smallest;
};

var computePairDistances = function(scene){
    var tile;
    distance = 0;
    var valuesComplete = [];
    for (var x = 0; x < scene.size; x++) {
        for (var y = 0; y < scene.size; y++) {
          tile = scene.grid.cellContent({ x: x, y: y });
          var value;
          if (tile) {
            value = tile.value;
          }
          else
          {
            value = 2;
          }
            var wasChecked = false;
            for(var i=0; i<valuesComplete.length; i++)
            {
                if(valueComplete[i] == value)
                    wasChecked = true;
            }
            if(!wasChecked)
            {
                distance += checkDiff(scene, value, x, y);
            }

        }
      }
    return distance;
};

var checkDistances = function(scene, value, tx, ty)
{
    var distance = 0;
     for (var x = 0; x < scene.size; x++) {
            for (var y = 0; y < scene.size; y++) {
              tile = scene.grid.cellContent({ x: x, y: y });
              if (tile) {
                if((x != tx || y != ty) && tile.value == value)
                {
                    distance += Math.abs(tx-x) + Math.abs(ty-y);
                }
              }
              else
              {
                if((x != tx || y != ty) && value == 2)
                {
                    distance += Math.abs(tx-x) + Math.abs(ty-y);
                }
              }
            }
          }
    return distance;
};

var checkDiff = function(scene, value, tx, ty)
{
    var distance = 1;
    for(var x=-1; x<1; x++)
    {
        for(var y=-1; y<1; y++)
        {
            if(tx+x>0 && tx+x<4 && ty+y>0 && ty+y<4) // && (x==0 || y==0) //for only non-diagonal
            {
                var tile = scene.grid.cellContent({x:tx+x, y:ty+y});
                if(tile)
                {
                    var dist = (value/tile.value>tile.value/value?value/tile.value:tile.value/value);
                    distance *= dist;
                }
                else
                {
                    var dist = (value/2)
                    distance *= dist;
                }
            }
        }
    }
    return distance;
};

var computeDifferences = function(scene)
{
    var distance = 1;
     for (var x = 0; x < scene.size; x++) {
        for (var y = 0; y < scene.size; y++) {
          var tile = scene.grid.cellContent({ x: x, y: y });
          var value = 2;
          if (tile) {
                value = tile.value;
          }
          var tileMulti = 0;
          if(x-1 > 0 && x+1 < 4)
          {
            var rValue = 2;
            var right = scene.grid.cellContent({ x: x+1, y: y });
            if (right) {
                    rValue = right.value;
              }
            var lValue = 2;
            var left = scene.grid.cellContent({ x: x-1, y: y });
            if (left) {
                    lValue = left.value;
              }
            if((value > rValue && value > lValue) || (value < rValue && value < lValue))
              tileMulti+=10;
          }
          if(y-1 > 0 && y+1 < 4)
          {
              var uValue = 2;
              var up = scene.grid.cellContent({ x: x, y: y-1 });
              if (up) {
                      uValue = up.value;
                }
              var dValue = 2;
              var down = scene.grid.cellContent({ x: x, y: y+1 });
              if (down) {
                      dValue = down.value;
                }
              if((value > dValue && value > uValue) || (value < dValue && value < uValue))
                tileMulti+=10;
          }

          if(x+1 < 4)
          {
            var rValue = 2;
            var right = scene.grid.cellContent({ x: x+1, y: y });
            if (right) {
                    rValue = right.value;
              }
            var a = value / rValue;
            var b = rValue/value;
            var dist = (a>b?a:b);
            distance += dist+tileMulti;
            //distance += Math.abs(value-rValue)*tileMulti;

          }
          if(y+1 < 4)
          {
              var dValue = 2;
              var down = scene.grid.cellContent({ x: x, y: y+1 });
              if (down) {
                      dValue = down.value;
                }
              var a = value / dValue;
              var b = dValue/value;
              var dist = (a>b?a:b);
              distance += dist+tileMulti;
              //distance += Math.abs(value-dValue)*tileMulti;
          }
        }
      }
    return distance;
};

var computeTileDiff = function(scene, tValue, x, y)
{

}


var runScenerio = function(gm, dir)
{
    var be = new botEngine(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
    be.grid = new Grid(gm.grid.size, gm.grid.serialize().cells);
    be.move(dir);
    return be;
};