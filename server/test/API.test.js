import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import request from 'supertest';
import { app } from "../index.mjs";

const admin = { username: "admin", password: "password" };
const budget = { budget: 1000 };
let adminCookie;

const login = async (userInfo) => {
    return new Promise ((resolve, reject) => {
        request(app)
            .post(`/api/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

beforeAll(async () => {
    adminCookie = await login(admin);
})

afterAll(async () => {
    await request(app).delete('/api/process');
})

describe('/api/process', async () => {
    test('POST /api/process', async () => {
        request(app).post('/api/process')
            .send(budget)
            .set("Cookie", adminCookie)
            .expect(200);
    })
})