// NOT FULLY PORTED
import GetComputerResponsibility from "../behavior/GetComputerResponsibility.js";
import GetResponsibility from "../behavior/GetResponsibility.js";
import GoTo from "../behavior/GoTo.js";
import GoToLazy from "../behavior/GoToLazy.js";
import HandleResponsibility from "../behavior/HandleResponsibility.js";
import Vector3 from "../math/Vector3.js";
import GetHealthInformationResponsibility from "../behavior/responsibility/GetHealthInformationResponsibility.js";
import GoToResponsibility from "../behavior/GoToResponsibility.js"

class responsibility {

    constructor(myIndex, locations, start, end) {
        this.index = myIndex;
        this.waypoints = [];
        this.waypoints.push(start);
        this.waypoints.push(end);

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference

        //   let me = agent;
        //let me = Hospital.agents.find(a=>a.id==self.index);
        let me = () => Hospital.agents.find(a => a.id == myIndex);

        let goToComputer = new GoToLazy(self.index, () => me().Computer.position).tree;
        let getResponsibility = new GetResponsibility(myIndex, locations).tree;
        let goToResponsibility = new GoToResponsibility(myIndex, locations).tree;
        //let myGoal = me.Computer;
        //this.goTo = new GoTo(self.index, myGoal.position);

        this.tree = builder
            .sequence("Responsibility")


            // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
            .do("getRooms", (t) => {
                let agent = Hospital.agents.find(a => a.id == myIndex);
                agent.addRoom(locations.find(l => l.name == "C1"));
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            // MAKE OWN FILE IF SHOWS UP ANYWHERE ELSE
            .do("getComputer", (t) => {
                // Not sure if medician subclass is implemented
                switch (me().MedicianSubclass) {
                    case "Tech":
                        me().Computer = locations.find(l => l.name == "TechPlace");
                        break;
                    case "Nurse":
                        me().Computer = locations.find(l => l.name == "NursePlace");
                        break;
                    case "Resident":
                        me().Computer = locations.find(l => l.name == "ResidentStart");
                        break;
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })

            // REPEAT
            //.sequence("Computer Operations")
            //.splice(new GoToLazy(self.index, me=>me.Computer).tree) // GO TO COMPUTER
            //.splice(new GoToLazy(self.index, () => me().Computer.position).tree)// GO TO COMPUTER
            .do("Go to my computer", async function (t) {
                let result = await goToComputer.tick(t);
                return result;
            })// GO TO COMPUTER

            //.selector("Emergency")
            //.do("Handle Emergency", (t) => { return fluentBehaviorTree.BehaviorTreeStatus.Failure; }) // PLACEHOLDER
            //.inverter("")
            //.sequence("Computer Stuff")
            //.splice(new GoToLazy(self.index, () => me().Computer).tree) // GO TO COMPUTER

            //NOT FINISHED
            //.splice(new GetComputerResponsibility(myIndex, locations).tree)
            //NOT FINISHED
            //.splice(new HandleResponsibility(myIndex, locations).tree)


            //.end()
            //.end()
            //.inverter("")
            //.sequence("Handle Responsibility")
            //.splice(new GoToLazy(self.index, () => me().Computer).tree) // GO TO COMPUTER

            //NOT FINISHED
            .do("Get Responsibility", async function (t) {
                let result = await getResponsibility.tick(t);
                return result;
            })
            .do("Go to Responsibility", async function (t) {
                let result = await goToResponsibility.tick(t)
                return result;
            })

            // .do("Go To Responsibility", (t) => {
            //     //WRITE THIS BEHAVIOR
            //     throw new Exception("Not implemented)")
            // })
            .do("Wait For Responsibility Patient", (t) => {
                let responsibility = me().Responsibility;
                let patient = me().CurrentPatient;

                let patientLocation = Vector3.fromObject(patient.Location);


                let distance = Vector3.fromObject(me().Location).distanceTo(patientLocation);
                if (distance < 2) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                }
                return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .do("Set Up Transport", (t) => {
                //WRITE THIS BEHAVIOR    
                throw new Exception("Not implemented)")
            })
            //NOT FINISHED
            .splice(new HandleResponsibility().tree)

            // UNTIL FAIL?
            //.sequence("Reassess Responsibility")
            .do("Reassess", (t) => {
                //WRITE THIS BEHAVIOR
                throw new Exception("Not implemented)")
            })
            //NOT FINISHED
            .splice(new HandleResponsibility().tree)
            //.end()
            //.end()
            .do("Do Nothing", (t) => {
                // return running?
                // behavior runs once and succeeds, and if called again, returns running
            })

            //.end()
            //.end()

            .end()
            .build();
    }

    async update( crowd, msec) {
        //this.toReturn = null;//Set the default return value to null (don't change destination)
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
        //return this.toReturn; //Return what the behavior tree set the return value to
    }

}

export default responsibility;