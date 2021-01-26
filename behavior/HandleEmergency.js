class HandleEmergency {
    constructor() {
               
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        
        this.tree = builder
          .sequence("Handle Emergency")
            .do("Return failure", (t) => {
                return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          })
          
          .end()
          .build();
      }
    
      async update(agentConstants, positions, msec) {
        await this.tree.tick({ agentConstants, positions, msec }) //Call the behavior tree
      }
    
    }
    
    export default HandleEmergency;