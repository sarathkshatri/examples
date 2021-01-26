// NOT FULLY PORTED
import GetComputerResponsibility from "../behavior/GetComputerResponsibility.js";
import GetResponsibility from "../behavior/GetResponsibility.js";
import GoTo from "../behavior/GoTo.js";
import HandleEmergency from "../behavior/HandleEmergency.js";
import HandleResponsibility from "../behavior/HandleResponsibility.js";
import Reassess from "../behavior/Reassess.js";
import SetupTransport from "../behavior/SetupTransport.js";
import WaitForResponsibilityPatient from "../behavior/WaitForResponsibilityPatient.js";

class responsibility {

    constructor(agent, myIndex, start, end) {
      this.index = myIndex;
      this.waypoints = [];
      this.waypoints.push(start);
      this.waypoints.push(end);
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
  
      let me = agent;

      let runOnce = false;
      //let myGoal = me.Computer;
      //this.goTo = new GoTo(self.index, myGoal.position);

      this.tree = builder
      .sequence("Responsibility")
        
        // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
        .do("getRooms", (t) => {
            me.addRoom(me.locations.find(l => l.name == "C1"));
            return fluentBehaviorTree.BehaviorTreeStatus.Success; 
        })
        // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
        .do("getComputer", (t) => {
            // Not sure if medician subclass is implemented
            switch(me.MedicianSubclass) {
                case Tech:
                    me.Computer(me.locations.find(l => l.name == "TechPlace"));
                    break;
                case Nurse:
                    me.Computer(me.locations.find(l => l.name == "NursePlace"));
                    break;
                case Resident:
                    me.Computer(me.locations.find(l => l.name == "ResidentStart"));
                    break;
                }

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
        })

        .sequence("Computer Operations")
            .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER
        
            .selector("Emergency")
                
                .splice(new HandleEmergency().tree)
                
                //.inverter("")
                .sequence("Computer Stuff")
                    .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER
                    
                    //HOW TO REFERENCE COMPUTER
                    .splice(new GetComputerResponsibility().tree)
                    //HOW TO IMPLEMENT COMMENTS SYSTEM
                    .splice(new HandleResponsibility().tree)


                .end()
                //.end()
                //.inverter("")
                .sequence("Handle Responsibility")
                    .splice(new GoTo(self.index, me.Computer)) // GO TO COMPUTER

                    //NOT FINISHED
                    .splice(new GetResponsibility().tree)

                    .do("Go To Responsibility", (t) => {
                        //WRITE THIS BEHAVIOR
                    })
                    
                    .splice(new WaitForResponsibilityPatient().tree)

                    //NOT FINISHED
                    .splice(new SetupTransport().tree)

                    //NOT FINISHED
                    .splice(new HandleResponsibility().tree)

                    .sequence("Reassess Responsibility")
                        //NOT FINISHED
                        .splice(new Reassess().tree)
                        
                        //NOT FINISHED
                        .splice(new HandleResponsibility().tree)
                    .end()
                //.end()
                .do("Do Nothing", (t) => {
                    if (runOnce)
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    runOnce = true;
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;    
                })

            .end()
        .end()

      .end()
      .build();
    }
  
    async update(agentConstants, crowd, msec) {
      await this.tree.tick({ agentConstants, crowd, msec }) //Call the behavior tree
    }
  
  }

export default responsibility;