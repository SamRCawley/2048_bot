var intMap = [];


var setup = function(){
    for(var i=1; i<=15; i++)
    {
        intMap[i] = Math.pow(2, i);
    }
};

var serialize = function(scene)
{
    //@todo move to java servlet and use 64bit hex
    var serialized = [];
    var i=0;
    for(var x = 0; x<scene.size; x++)
    {
        for(var y=0; y<scene.size; y++)
        {
            var tile = scene.grid.cellContent({ x: x, y: y });
            if(tile)
                serialized[i]=intMap[tile.value];
            else
                serialized[i]=0;
        }
    }
    return serialized;
};

var averageMaxTile = function(gm, dir)
{
    //@todo if scene indexed return avgMax from index else...
    var scene = runScenerio(scene, dir);
    if(!scene.moved)
        return 0;
    var cells = scene.grid.availableCells();
    var pathCount = 0;
    var total = 0;
    for(var j=0; j<cells.length; j++)
    {
        var bestOfSet = 0;
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
             var s_diffTwo = 0;
             var s_diffFour = 0;
             if(!be.movesAvailable())
                s_diffTwo = 0.9*getMax(be);
             else
                 s_diffTwo = 0.9*averageMaxTile(be, dir);
             if(!bFour.movesAvailable())
                s_diffFour = 0.1*getMax(be);
             else
                 s_diffFour= 0.1*averageMaxTile(bFour, dir);
             var s_diff = s_diffTwo+s_diffFour;
             if(s_diff>bestOfSet)
             {
                pathCount++;
                bestOfSet = s_diff;
             }
         }
         delete be;
         delete bFour;
         total += bestOfSet;
    }
    return avg/pathCount;
}

var getBestDirection(scene){
    var best = 0;
    var bestDir = 0;
    for(var i=0; i<4; i++)
    {
        var isValid = runScenerio(scene, i).moved;
        if(isValid)
        {
            var avgMax = averageMaxTile(scene, i);
            if(avgMax > best)
            {
                bestDir=i;
                best = avgMax;
            }
        }
    }
    return bestDir;
}

var getMax(scene)
{
    var max=0;
    for(var x = 0; x<scene.size; x++)
    {
        for(var y=0; y<scene.size; y++)
        {
            var tile = scene.grid.cellContent({ x: x, y: y });
            if(tile && tile.value > max)
                max = tile.value;
        }
    }
    return max;
}