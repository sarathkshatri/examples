import FollowInstructions from "../behavior/FollowInstructions.js";
import GoTo from "../behavior/GoTo.js";
import Stop from "../behavior/Stop.js";
import WaitForever from "../behavior/WaitForever.js";



class patient {

  constructor(agent, myIndex, start, end) {
    this.index = myIndex;
    this.waypoints = [];
    this.waypoints.push(start);
    this.waypoints.push(end);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = agent;
    let myGoal = me.locations.find(l => l.name == "CHECK_IN");
    if (!myGoal) throw new "We couldn't find a location called CHECK_IN";

    this.goTo = new GoTo(self.index, myGoal.position);

    this.tree = builder

    .sequence("Patient Actions")         
      .selector("Check In")
        .splice(this.goTo.tree) // CHECK_IN

        .splice(new Stop().tree)

      .end()
      
      //
      .do("Log Text", (t) => {
        // "I stopped"
      })
      //

      .splice(new FollowInstructions().tree)

      .splice(new WaitForever().tree)
    .end()
    .build();
  }

  async update(agents, crowd, msec) {
    this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
    return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;
