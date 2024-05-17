import List from '../models/list-schema.js';
import User from '../models/user-schema.js';
import csv from 'csv-parser';
import fs from 'fs';
import { deleteFiles } from '../utility/deleteFiles.js';
export const createList = async (req, res) => {
    try {
        console.log(req.body)
        const { title, customProperties } = req.body;
        const list = new List({ title, customProperties });
        await list.save();
        res.status(201).json(list);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const addUsers = async (req, res) => {
    try {
        const { listId } = req.params;
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ error: 'List not found' });

        const results = [];
        const errors = [];
        let totalUsers = 0;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                for (const user of results) {
                    try {
                        const userData = {
                            name: user.name,
                            email: user.email,
                            properties: new Map()
                        };
                        for (const prop of list.customProperties) {
                            userData.properties.set(
                                prop.title,
                                user[prop.title] || prop.fallback
                            );
                        }

                        const newUser = new User(userData);
                        await newUser.save();
                        list.users.push(newUser._id);
                        totalUsers++;
                    } catch (error) {
                        errors.push({ ...user, error: error.message });
                    }
                }

                await list.save();
                
                await deleteFiles()
                res.status(200).json({
                    added: totalUsers,
                    errors: errors.length,
                    total: list.users.length,
                    errorsList: errors
                });
            });
    } catch (error) {
        
        
        await deleteFiles()
        res.status(400).json({ error: error.message });
    }
};