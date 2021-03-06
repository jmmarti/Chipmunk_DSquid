/*
Lense object
 */

//can do up to 30 lenses (32 bit collision mask
//may start breaking after 30 lenses / walls / globals

var Lense = function(s, centerX, centerY, rad){
//if radius == 0 then it is global


	var space = this.space = s;
	var center = this.center = v(centerX, centerY);
	var radius = this.radius = rad + 0.01;
	var mass = 10000;

	var body = this.body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, v(0, 0))));
		body.setPos(center); //this is a hack to ensure the attractor isn't at length 0 

	var shape = this.shape = space.addShape(new cp.CircleShape(body, radius, v(0, 0)));
		shape.setSensor(true);
		shape.type = "lense";

    var filterList = this.filterList = [];
    var global = this.global = false;

    this.addFilter(Filter());
    fuiController.lensesList.push(this);

};

Lense.prototype.updateSize = function(rad) {
	this.radius = rad;
	this.shape.r = rad;
	this.body.r = rad;
};

Lense.prototype.getPoints = function() {
	var returnVal = [];
	//look through all datapoints 
	this.space.shapeQuery(this.shape, function(b, set){
		returnVal.push(b.datapoint);
	});
	
	//return the points inside bounds
    //console.log(returnVal);
	return returnVal;
	
};

Lense.prototype.draw = function(ctx, scale, point2canvas) {

	//console.log("drawinglense");
	//draw shape based on lense style? nahh, hard code dat shit
	var c = point2canvas(this.center);
	ctx.beginPath();
	ctx.arc(c.x, c.y, scale * this.radius, 0, 2*Math.PI, false);
	ctx.stroke();
	ctx.closePath();

};

Lense.prototype.addFilter = function(filter) {
	//add a filter here
    this.filterList.push(filter);
};

Lense.prototype.callFilters = function(){
    //iterate through all filters
    var disabled = [];


    for(var i = 0; i < this.filterList.length; i++){
        //get disabled[] from all of the filters
        if(this.global == false){
            disabled = this.filterList[i].filter_points(this.getPoints()).disabled;
        }
        else{
            disabled = this.filterList[i].filter_points().disabled;
        }
        //console.log(disabled);

        //change styling on disabled points
        for(var j = 0; j < disabled.length; j++){
            //console.log(disabled[j]);
            if(typeof(disabled[j]) != "undefined"){
                disabled[j].filteredOut = true;
            }

        }
    }
}