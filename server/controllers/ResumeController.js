import Resume from "../models/Resume.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs";
import path from "path";
// controler for creating a new resumes 


// post /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        console.log('createResume called - userId:', userId, 'title:', title);

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: missing user' });
        }

        // create a new resume
        const newResume = await Resume.create({
            userId,
            title
        })
        // return success message with resume data
        return res.status(201).json({message: "Resume created successfully", resume: newResume})
    } catch (error) {
        console.error('createResume error:', error);
        return res.status(400).json({message: error.message})
    }
} 
// controller for deleting a resume 
// DELETE:/api/resumes/delete

export const deleteResume = async(req, res)=>{
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId, _id: resumeId})

        // return success message

        return res.status(200).json({message: "Resume deleted successfully"})

    } catch (error) {
        return res.status(400).json({message: error.message})

    }
}
//  get user resumes by id 
// GET /api/resumes/user

export const getResumeById = async(req, res)=>{
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        const resume = await Resume.findOne({userId,_id: resumeId})
        // return success message


        if(!resume){
            return res.status(404).json({message: "Resume not found"})
        }
        return res.status(200).json({ resume})

        

    } catch (error) {
        return res.status(400).json({message: error.message})

    }

}
// get resume by id public
// GET /api/resumes/public/
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

//  controller for updating a resume
// PUT /api/resumes/update
export const updateResume = async(req, res)=>{ 
    try {
        const userId = req.userId;
        const { resumeId, resumeData ,removeBackground} = req.body;
        const image = req.file;


        let resumeDataCopy ;
        if (typeof resumeData === 'string') {
            resumeDataCopy = await  JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData);
        }
        if (image){
            const imageBufferData = fs.createReadStream(image.path);


            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre :'w-300,h-300,fo-face, z-0.75'+ (removeBackground ? ',e-bgremove' : '')

  }
});

resumeDataCopy.personal_info.image = response.url;
        }
        const resume = await Resume.findOneAndUpdate({
            userId,
            _id: resumeId
        }, resumeDataCopy, {new: true})
        return res.status(200).json({message: "Resume updated successfully", resume})
    } catch (error){
        return res.status(400).json({message: error.message})

    }
}
