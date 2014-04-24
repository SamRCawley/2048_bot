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

var averageMaxTile = function(scene, dir)
{
    //@todo if scene indexed return avgMax from index else...
    var scene = runScenerio(scene, dir);
    var ends = 0;
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