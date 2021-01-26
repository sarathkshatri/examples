


/**
 * Created by bricks on 6/19/2018.
 */

 //import { NamedModulesPlugin } from "webpack";
import Vector3 from "./Vector3.js"

class ABehavior {

    index;
    location;
    agentConstants;
    positions;
    msec;


    constructor(myIndex) {
        this.index = myIndex;
    }

    update(agentConstants, positions, msec) {
        //Do nothing since this is the default "none" behavior.

        let idx = agentConstants[this.index].idx;
        let position = positions.find(a=>a.id == this.index);
        if(!position || position.length == 0) return null; //Most likely our first tick and the simulation hasn't given us an official position yet
        let x = position.x;
        let y = position.y;
        let z = position.z;

        this.location = new Vector3(x, y, z);
        this.agentConstants = agentConstants;
        this.positions = positions;
        this.msec = msec;

        return this.checkEndOfSimulation();

    }


}
export default ABehavior;