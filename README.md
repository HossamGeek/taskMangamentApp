Getting Started
## Description
    Task Managment App :
        *contain three servcies : 
            1- users service
            2- tasks service
            3- depart service
        *every service contain 
            -controlle : business or logic layer
            -middleware : validation layer to valid data from request both headers or body
            -model : mongodb schema
            -routes : handel request path 
        *design pattern used in app : singleton and dependency injection
        *notes : 
            *CollectionManager.class : as data modeling layer set global method about orm mongoose
            *DBMongo.class : to congfig database connection
            *globalFunc : as global functions used in app to decrease duplicated code   



## Installation
    #To Run App
    1- node and mongodb is require.  
    2- create gmail account to mailer send notification  
        and go to https://www.google.com/settings/security/lesssecureapps  
        then enabled less secure apps : turn on.
    3- ```bash   
            $ npm i 
       ```


## Running the app


    # in .env file please set 
        senderAuthEmail='Ex@gmail.com' //email as gmail
        senderAuthPassword='Password'

    ```bash
    $ npm start
    ```


## Role (Admin - User)

## Api :

## Users :

    #For Signup as user and send a generated code in your mail to active yor account
    Method: POST
    Route : http:localhost:3000/signup
    Body:{
        username:"",password:"",email:""
    }


    #For Signin as user or admin
    Method: POST
    Route : http:localhost:3000/users/signin
    Body:{
        username:"",password:""
    }
    response:{
        data:{token_id,email}
    }

    #For Confirm your account to activate
    Method: POST
    Route : http:localhost:3000/users/confirm
    Body:{
        username:"",genereted_code:""
    }

    #If not send  generated code to your mail you can send again 
    Method: POST
    Route : http:localhost:3000/users/resend
    Body:{
        username:""
    }

    #For create new user as admin
    Method: POST
    Route : http:localhost:3000/users/signin
    Body:{
        username:"",password:"",email:"",role:"admin" or "user"
    }
    headers:{
        authorization : "Baerer token_id"
    }


## Departments : 

    #For create new department as admin
    Method: POST
    Route : http:localhost:3000/depart/new
    Body:{
        depart_name:"",depart_id:""
    }
    headers:{
        authorization : "Baerer token_id"
    }


    #For get all departments 
    Method: GET
    Route : http:localhost:3000/depart/all



## Tasks : 


    #For create new task as admin
    Method: POST
    Route : http:localhost:3000/tasks/new
    Body:{
        name:"",//task name
        responsible_name:"",
        email:"",
        phone:"",
        depart_id:"" //number
    }
    headers:{
        authorization : "Baerer token_id"
    }


    #For get all Tasks 
    Method: GET
    Route : http:localhost:3000/tasks/all


    #For get all Tasks  by  createdBy
    Method: GET
    Route : http:localhost:3000/tasks/createdBy/:createdBy

    #For get all Tasks  by  departId
    Method: GET
    Route : http:localhost:3000/tasks/departId/:depart_id

    #For get all Tasks  by  responsible_name
    Method: GET
    Route : http:localhost:3000/tasks/responsible_name/:responsible_name

    #For get all Tasks by  status
    Method: GET
    Route : http:localhost:3000/tasks/status/:type


    #For update Task to done as user or admin by task ID
    Method: PUT
    Route : http:localhost:3000/tasks/done/:id


    #For update Task to confirm as  admin by task ID
    Method: PUT
    Route : http:localhost:3000/tasks/confirm/:id

    #For update Task to deactivate as  admin by task ID
    Method: PUT
    Route : http:localhost:3000/tasks/deactivate/:id


    #For edit task as admin who's create this task by task ID
    Method: PUT
    Route : http:localhost:3000/tasks/update/:id
    Body:{
        name:"",//task name
        responsible_name:"",
        email:"",
        phone:"",
        depart_id:"" //number
    }
    headers:{
        authorization : "Baerer token_id"
    }
