

function User(username, role, name) {
    this.username = username,
        this.role = role,
        this.name = name
}

const Role = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER'
}

export { User, Role };