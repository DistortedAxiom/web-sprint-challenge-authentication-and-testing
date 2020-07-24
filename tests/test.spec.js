const supertest = require("supertest");

const server = require("../api/server.js");
const db = require("../database/dbConfig");

afterAll(async () => {
    return db('users').truncate();
});

describe("server", function () {

    it("runs the tests", function () {
        expect(true).toBe(true);
    });

    let user = {
        username: "NewUser",
        password: "Password",
        token: ""
    }

    describe("POST api/auth/register", () => {

        it("Return error when no username or password is given", () => {
            return supertest(server)
                .post("/api/auth/register")
                .send({
                })
                .then(res => {
                    expect(res.status).toBe(500)
                })
        })

        it("Create a new user", () => {
            return supertest(server)
                .post("/api/auth/register")
                .send({
                    username: "NewUser",
                    password: "Password"
                })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })
    })

    describe("POST /api/auth/login", () => {

        it("Return an error with invalid login and password", () => {
            return supertest(server)
                .post("/api/auth/login")
                .send({
                    username: "John",
                    password: "Doe"
                })
                .then(res => {
                    expect(res.body.message).toBe("Invalid credentials")
                    expect(res.status).toBe(401)
                })
        })

        it("Successful login returns token", () => {
            return supertest(server)
                    .post("/api/auth/login")
                    .send({
                        username: "NewUser",
                        password: "Password"
                    })
                    .then(res => {
                        expect(res.status).toBe(200)
                        user.token = res.body.token
                    })
        })

    })

    describe("GET /api/jokes", () => {

        it("Cannot accesss without valid credentials", () => {
            return supertest(server)
                    .get('/api/jokes')
                    .then(res => {
                        expect(res.status).toBe(400)
                        expect(res.body.message).toBe("A authorization header token is required")
                    })
        })

        it("Return jokes when you authorization is successful", () => {
            return supertest(server)
                    .get('/api/jokes')
                    .set('Authorization', user.token)
                    .then(res => {
                        expect(res.status).toBe(200);
                        expect((res.body).length).toBeGreaterThan(0)
                    })
        })

    })
})
