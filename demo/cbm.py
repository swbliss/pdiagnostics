# -*- coding:utf-8 -*-

from rpy2.robjects.packages import SignatureTranslatedAnonymousPackage

rcode = """

#####################################
#####################################
##########  Item_Opt.R  #############
#####################################
#####################################
Item_opt_Base <- function(numM,numS,state, Tlength,P1,P2,P3, UserCost, AgencyCost) {

  inf<-100000000

  Sol<-list(Action="", AC="",V="")

  # Planning periods
  t<-c(1:(Tlength-1))

  # Discount rate
  alpha<-1/(1+0.05)

  # MR&R measure 1:Do nothing , 2: Minor Maintenance, 3: Replacement
  a<-c(1:numM)

  # state
  s<-c(1:numS)


  #   Matrix init
  V<-matrix(data = NA, nrow = numS, ncol = Tlength+1, byrow = TRUE, dimnames = NULL)
  mu<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  V1<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  mu1<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  V2<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  mu2<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  AC<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  AC1<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)
  AC2<-matrix(data = NA, nrow = numS, ncol = Tlength, byrow = TRUE, dimnames = NULL)



  C <- matrix(NA, nrow=numM, ncol=numS, byrow=TRUE)
  for(i in 1:numM){
    for(j in 1:numS){
      C[i,j] <- UserCost[j]+AgencyCost[i]
    }
  }

  # Salvage value Assignment
  V[,(Tlength+1)]<- c(-354.5, -325, -300, -270, -230, -172, -128, -65, -3.5, -0.5)%/%10




  #    Calculate V and policy mu using dynamic programming


  for (t in Tlength:1){
    for (i in 1:numS){

      ev<-c()

      # for (j in smin:numS){
      #   V[j,t+1]<-inf
      # }

      ev[1] <- C[1,i] + alpha * P1[i,] %*% V[,t+1]
      ev[2] <- C[2,i] + alpha * P2[i,] %*% V[,t+1]
      ev[3] <- C[3,i] + alpha * P3[i,] %*% V[,t+1]

      # select the best


      act<-order(ev)

      V[i,t]<-ev[act[1]]
      mu[i,t]<-act[1]

      V1[i,t]<-ev[act[2]]
      mu1[i,t]<-act[2]

      V2[i,t]<-ev[act[3]]
      mu2[i,t]<-act[3]

      AC[i,t]<-C[mu[i,t],i];
      AC1[i,t]<-C[mu1[i,t],i];
      AC2[i,t]<-C[mu2[i,t],i];


    }

  }

  # Assign Optimal and altternative solution values

  state<-10-state+1
  Sol$Action[1]<-mu[state,1]
  Sol$AC[1] <- AgencyCost[as.numeric(Sol$Action[1])]
  Sol$V[1]<-V[state,1]

  Sol$Action[2]<-mu1[state,1]
  Sol$AC[2] <- AgencyCost[as.numeric(Sol$Action[2])]
  Sol$V[2]<-V1[state,1]

  Sol$Action[3]<-mu2[state,1]
  Sol$AC[3] <- AgencyCost[as.numeric(Sol$Action[3])]
  Sol$V[3]<-V2[state,1]

  # return item-level optimal result
  return(Sol)
}

#####################################
#####################################
##########  GetInput.R  #############
#####################################
#####################################
### THESE PARAMETERS or DATA ARE REQUIED TO BE INPUT BY USER ###

Input_ItemOpt <- function(){
  UserCost <- c(0,40,80,120,160,200,240,400,600,1000) #User cost for each state (»óÅÂ º° »ç¿ëÀÚºñ¿ëÁ¤º¸)
  AgencyCost <- c(0,30,500)  # The action cost for each maintenance action(À¯Áöº¸¼ö º° ºñ¿ëÁ¤º¸)
  Tlength <- 40 #Planning years(À¯Áöº¸¼ö °èÈ¹ ³â¼ö)

  ## The transition matrix for the 1st maintenance action (No maintenance)
  P1<-matrix(
    c(  0.68,1-0.68,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
        0.00,0.78,1-0.78,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
        0.00,0.00,0.75,1-0.75,0.00,0.00,0.00,0.00,0.00,0.00,
        0.00,0.00,0.00,0.67,1-0.67,0.00,0.00,0.00,0.00,0.00,
        0.00,0.00,0.00,0.00,0.66,1-0.66,0.00,0.00,0.00,0.00,
        0.00,0.00,0.00,0.00,0.00,0.68,1-0.68,0.00,0.00,0.00,
        0.00,0.00,0.00,0.00,0.00,0.00,0.50,1-0.50,0.00,0.00,
        0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.55,1-0.55,0.00,
        0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.49,1-0.49,
        0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,1.00), nrow = 10, ncol = 10, byrow = TRUE)

  ## The transition matrix for the 2nd maintenance action (Partial repair)
  P2<-matrix(
    c(
      0.80,1-0.80,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
      0.68,1-0.68,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
      0.00,0.78,1-0.78,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
      0.00,0.00,0.75,1-0.75,0.00,0.00,0.00,0.00,0.00,0.00,
      0.00,0.00,0.00,0.67,1-0.67,0.00,0.00,0.00,0.00,0.00,
      0.00,0.00,0.00,0.00,0.66,1-0.66,0.00,0.00,0.00,0.00,
      0.00,0.00,0.00,0.00,0.00,0.68,1-0.68,0.00,0.00,0.00,
      0.00,0.00,0.00,0.00,0.00,0.00,0.50,1-0.50,0.00,0.00,
      0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.55,1-0.55,0.00,
      0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.49,1-0.49), nrow = 10, ncol = 10, byrow = TRUE)

  ## The transition matrix for the 3rd maintenance action (Reconstruction)
  P3<-matrix(
    c( 1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,
       1.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00), nrow = 10, ncol = 10, byrow = TRUE)

  ## State list for all road images
  state <- c(4,5,6,7,8,9,10)
  return(list(UserCost, AgencyCost, Tlength, P1,P2,P3, state))
}



### THESE PARAMETERS or DATA ARE REQUIED TO BE INPUT BY USER ###

Input_SysOpt <- function(){
  Budget <- 1200
  return(Budget)
}


#####################################
#####################################
#########  System_Opt.R  ############
#####################################
#####################################
Sys_Opt <- function(Budget,Sol.AC, Sol.Action, Sol.V){

  cat("\n CBM>> System Level Optimization started!\n")

  #Minimum
  NoItems <- nrow(Sol.AC)
  X0<-as.integer(c(rep(1,NoItems)))
  X1<-as.integer(c(rep(2,NoItems)))

  #initial solution
  X.Action<-c(rep(1,NoItems))

  # Intitial Value of the Total Expected Cost

  TECi<-0
  ACi<-0

  for (i in 1:length(X.Action)){
    TECi<-TECi+as.numeric(Sol.V[i,1])
    ACi<-ACi+as.numeric(Sol.AC[i,1])
  }


  # system level optimization with Evolutiomn Algorithm


  # Variable Setting----------------------
  #Number of children solution
  n <-100

  # Initial Parent Solution
  px<-X.Action
  TEC0 <- NEA.Eval(px, Budget, Sol.V, Sol.AC)
  # Budeget Constriant

  #Children Population Generation Parameter

  sdev0<-0.35
  sdev<-sdev0
  # Max Iteration
  MaxIter<- 10000
  # Variable Setting----------------------

  NoOpt<-0
  prevTEC<-TEC0


  MAC<-c()
  MTEC<-c()

  for(m in 1:MaxIter){

    # Population Generation
    y <- NEA.PopGen(px,n,NoItems,sdev, Sol.V)

    # Find the best solution among the population
    px<-NEA.FindBest(y,px,Budget, Sol.V, Sol.AC)
    TEC<-NEA.Eval(px, Budget, Sol.V, Sol.AC)
    AC<-NEA.EvalAC(px, Sol.AC)
    # cat("\r CBM>> Iteration [",m,"]: TEC=",TEC, "AC/Budget=",AC, "/", Budget, "   ")
    # enlarge the search space
    if (TEC==prevTEC){
      sdev<-sdev0*(1.01^NoOpt)
      NoOpt<-NoOpt+1
    }else {
      sdev<-sdev0
      NoOpt<-0
    }

    MAC<-c(MAC,AC)
    MTEC<-c(MTEC,TEC)

    prevTEC<-TEC
    if (NoOpt>100) {break}
  }


  cat("\n\n CBM>> Final Solution Found-------------------------------------------")
  cat("\n CBM>> Optimal Action:", px)
  cat("\n CBM>> Action Cost:", AC)
  cat("\n CBM>> Total Expected Cost:", TEC)
  cat("\n CBM>> ---------------------------------------------------------------")

  return(list(px,AC,TEC,MAC))

}



NEA.Eval<-function(x, budget, Sol.V, Sol.AC){
  x<-round(x, digits = 0)
  TotalCost<-0
  AC<-0

  for (i in 1:length(x)){
    TotalCost<-TotalCost+as.numeric(Sol.V[i,x[i]])
    AC<-AC+as.numeric(Sol.AC[i,x[i]])

  }
  if(AC > budget) {TotalCost<-500000}

  return(TotalCost)
}

NEA.EvalAC<-function(px, Sol.AC){
  AC<-0
  for (i in 1:length(px)){
    AC<-AC+as.numeric(Sol.AC[i,px[i]])
  }
  return(AC)
}

NEA.FindBest<-function(y, x, budget, Sol.V, Sol.AC){

  TEC<-NEA.Eval(x, budget, Sol.V, Sol.AC)
  AC<-NEA.EvalAC(x, Sol.AC)
  solx<-0

  if(AC>budget){
    for(i in 1:length(x)){
      val<-NEA.EvalAC(y[i,], Sol.AC)

      if(val<AC){
        AC<-val
        solx<-i
      }
    }

  }
  else{

    for (i in 1:length(x)){
      val<-NEA.Eval(y[i,],budget, Sol.V, Sol.AC)
      valAC<-NEA.EvalAC(y[i,], Sol.AC)
      if(val<TEC && valAC<= budget){
        TEC<-val
        solx<-i
      }
    }

    if(TEC >100000) {solx<-0}

  }
  if(solx==0) {return(x)}
  else {return(y[solx,])}
}



NEA.CheckBudget<-function(x, budget){
  for (i in 1:length(x)){
    AC<-AC+as.numeric(Sol.AC[i,x[i]], Sol.AC)
  }

  if(AC<budget){return(TRUE)}
  else {return(FALSE)}
}


# EA population generation

NEA.PopGen<-function(px,n,nItems,sdev, Sol.V){

  y<-matrix(data = NA, nrow = n , ncol = nItems, byrow = TRUE, dimnames = NULL)

  for(i in 1:n){

    d<-(c(rnorm(n=nItems, mean=0, sd=sdev)))
    y[i,]<-round(px+d)
    for(j in 1:nItems){
      if(as.numeric(Sol.V[j,2])>100000) {y[i,j]<-1}
      if( y[i,j] < 1) {y[i,j]<-1}
      if( y[i,j] > 2) {y[i,j]<-2}
    }

  }

  return(y)
}



#####################################
#####################################
##########    MAIN.R    #############
#####################################
#####################################

## [ITEM OPTIMIZER]
########################### GET INPUTS FOR ITEM OPTIMIZER ###################################
inputs_item <-Input_ItemOpt()
UserCost <- inputs_item[[1]]  # User cost for each state
AgencyCost <- inputs_item[[2]]   # The action cost for each maintenance action
Tlength <- inputs_item[[3]] # Planning years
P1 <- inputs_item[[4]]  # The transition matrix for the 1st maintenance action (No maintenance)
P2 <- inputs_item[[5]]  # The transition matrix for the 2nd maintenance action (Partial repair)
P3 <- inputs_item[[6]]  # The transition matrix for the 3rd maintenance action (Reconstruction)
state  <- inputs_item[[7]]  # State list for all road images
##############################################################################################

item_optimizer <- function(UserCost, AgencyCost, Tlength, P1, P2, P3, state) {
    numM <- length(AgencyCost) # number of maintenance actions
    numS <- length(UserCost) # number of state defined
    NoItems <- length(state)
    Sol_Action <- Sol_AC <- Sol_V <- matrix(NA,nrow=NoItems, ncol=numM)
    # Column info for Sol_Action, Sol_AC, Sol_V
    ## col1: the best maintenance action, action cost, life-cycle cost
    ## col2: the second best maintenance action, action cost, life-cycle cost
    ## col3: the third best maintenance action, action cost, life-cycle cost

    # Row info for Sol_Action, Sol_AC, Sol_V
    ## each row is the item optimization result for each road state

    # RUN ITEM OPTIMIZER
    for(i in 1:NoItems){
      isol <- Item_opt_Base(numM, numS, state[i], Tlength, P1,P2,P3, UserCost, AgencyCost)
      Sol_Action[i,]<-isol$Action
      Sol_AC[i,]<-isol$AC
      Sol_V[i,]<-isol$V
    }

    result <- list(action=Sol_Action, ac=Sol_AC, v=Sol_V)
    return(result)
}



## [SYSTEM OPTIMIZER]
########################### GET INPUTS FOR SYSTEM OPTIMIZER ###################################
inputs_system <- Input_SysOpt()
Budget <- inputs_system[[1]]  # User cost for each state (»óÅÂ º° »ç¿ëÀÚºñ¿ëÁ¤º¸)
# Sol_AC, Sol_Action, Sol_V are also inputs of system optimizer
##############################################################################################

system_optimizer <- function(UserCost, AgencyCost, Tlength, P1, P2, P3, state, Budget) {
    io_result = item_optimizer(UserCost, AgencyCost, Tlength, P1, P2, P3, state)
    Sol_Action <- io_result[[1]]
    Sol_AC <- io_result[[2]]
    Sol_V <- io_result[[3]]

    cat("\n CBM>> budget:", Budget)
    cat("\n CBM>> Sol_action:", Sol_Action)
    cat("\n CBM>> Sol_AC:", Sol_AC)
    cat("\n CBM>> Sol_V:", Sol_V)


    OptActions_return <- double()

    Sys.Opt.Result <- Sys_Opt(Budget,Sol_AC,Sol_Action,Sol_V)
    OptActions <- Sys.Opt.Result[[1]]
    for(i in 1:length(OptActions)){
      OptActions_return[i] <- Sol_Action[i,OptActions[i]] # System Optimal Actions for each item
    }

    OptActionCosts <- Sys.Opt.Result[[2]] # The sum of Maintenance cost for this year (<= Budget)
    LCcost <- Sys.Opt.Result[[3]] #The sum of life cycle cost of all roads
    ACs<- Sys.Opt.Result[[4]] ## Plot on the screen

    result <- list(Sol_Action, Sol_AC, Sol_V, OptActions_return, OptActionCosts, LCcost, ACs)
    return(result)
}
"""


cbm = SignatureTranslatedAnonymousPackage(rcode, "cbm")
