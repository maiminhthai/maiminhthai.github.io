import UserDao from "../dao/user_dao.mjs";

const userDao = new UserDao();

export default function UserController() {

    this.getUserByCredentials = async (username, password) => {
        return userDao.getUserByCredentials(username, password);
    }
}