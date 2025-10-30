import users from "../user"


function Login(email, password) {
    for (let user = 0; user < users.length; user++) {
        const exist = array[user];
        if (exist?.email == email && exist?.password == password) {
            return "User Exist"
        }
        return "User Not Found"
    }
}