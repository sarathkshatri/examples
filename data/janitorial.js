import GoTo from "../behavior/GoTo.js";
import WaitForever from "../behavior/WaitForever.js";

class janitorial {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;
      let myGoal = me.locations.find(l => l.name == "Fast Track 1");
      if (!myGoal) throw new "We couldn't find a location called Fast Track";

      this.goTo = new GoTo(self.index, myGoal.position);

      this.tree = builder
      
      .sequence("Janitorial")
        .splice(this.goTo.tree) //Fast Track type
        .splice(new WaitForever().tree)  
      .end()
      .build();
    }
  
    async update(agents, crowd, msec) {
      await this.tree.tick({ agents, crowd, msec }) //Call the behavior tree
    }
  
  }

export default janitorial;
  