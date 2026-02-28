import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkle, User } from 'lucide-react'
import PersonalInfoForm from '../assets/Components/PersonalInfoForm'
import ResumePreview from '../assets/Components/ResumePreview'
import TemplateSelector from '../assets/Components/TemplateSelector'
import ColorPicker from '../assets/Components/ColorPicker'
import ProfessionalSummaryForm from '../assets/Components/ProfessionalSummaryForm'
import ExperienceForm from '../assets/Components/ExperienceForm'
import EducationForm from '../assets/Components/EducationForm'
import ProjectForm from '../assets/Components/ProjectForm'
import SkillsForms from '../assets/Components/SkillsForms'
import toast from 'react-hot-toast'
const Resumebuilder = () => {
  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)
  
  const [resumedata, setresumedata] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    skills: [],
    template: "classic", accent_color: "#3b8256",
    public: false,
  })

  const loadExistingResume = async () => {
    try {
      const {data} = await api.get('/api/resumes/get/'+resumeId,{headers:{Authorization:token}})
      if (data.resume) {
        setresumedata(data.resume)
        document.title = data.resume.title; 
      }
    } catch(error){
      console.error("Error loading resume:", error);
    } 
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [RemoveBackground, setRemoveBackground] = useState(false)

  const section = [
    { id: "personal", name: "Personal info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects ", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkle }
  ]
 

  const activeSection = section[activeSectionIndex]
  useEffect(() => {
    loadExistingResume()
  }, [resumeId])

    const changeResumeVisibility =async() => {
      try {
        const formData = new FormData()
        formData.append('resumeId', resumeId)
        formData.append("resumeData", JSON.stringify({ public: !resumedata.public}))
        const {data} = await api.put('/api/resumes/update', formData, {headers:{Authorization:token}})
    setresumedata ({...resumedata, public: !resumedata.public})
      toast .success(data.message)
       }catch (error) {
        console.error('Error changing resume visibility:', error);
      }
    }

    const handleShare = () => {
      const frontendUrl = window.location.href.split('/app/')[0] 
      const resumeUrl = frontendUrl + '/view/' +resumeId;

      if(navigator.share){
        navigator.share({
        
          text: ' My resume',
          url: resumeUrl
        }).then(() => console.log('Resume shared successfully'))
        .catch((error) => console.error('Error sharing resume:', error));
      }else{alert('Sharing not supported on this browser. Copy the link: ' + resumeUrl)}
    }
      const downloadResume = () => {
        window.print()

      }

      const saveResume = async()=>{
        try{
        let updateResumeData = structuredClone(resumedata)
        // remove image from updateRTesumedata
        if(typeof updateResumeData.personal_info.image === 'string'){ delete updateResumeData.personal_info.image}
          const formData = new FormData()   
          formData.append('resumeId', resumeId)
          formData.append('resumeData', JSON.stringify(updateResumeData))
         RemoveBackground && formData.append('removeBackground', 'yes')
            typeof resumedata.personal_info.image === 'object' && formData.append('image', resumedata.personal_info.image)
            const {data} = await api.put('/api/resumes/update', formData, {headers:{Authorization:token}})
            toast.success(data.message)
       
          }catch (error){
            console.error('Error saving resume:', error)
          }
      }
  return (
    <div>

      {/* back dashboard button */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link className=' inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all' to='/app'>

          <ArrowLeftIcon className='size-4' /> Back to Dashboard
        </Link>


      </div>
      <div className='max-w-7xl mx-auto px-4 py-8 '>
        <div className='grid lg:grid-cols-12 gap-8 '>
          {/* left panel */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progressbar */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />

              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000' style={{ width: `${activeSectionIndex * 100 / (section.length)}%` }} />
              {/* section navigate */}
              <div className='flex items-center'>
                <div className='flex justify-between items-center mb--6 border-b border-gray-300 py-1'>
                  <TemplateSelector selectedTemplate={resumedata.template} onChange = {(template)=>setresumedata(prev =>({...prev, template}))} />
                  <ColorPicker selectedColor={resumedata.accent_color} onChange = {(color) =>setresumedata(prev =>({...prev, accent_color : color}))} />
                </div>


                <div className='flex items-cente gap-2'></div>
                {activeSectionIndex !== 0 && (
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg 
                      text-sm font-medium text-gray-600 hover:bg-gray-50
                      transition-all' disabled={activeSectionIndex === 0}>
                    <ChevronRight className='size-4' /> Previous

                  </button>
                )}

                <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, section.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === section.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === section.length - 1} >
                  Next <ChevronRight className='size-4' />

                </button>

              </div>
              {/* form contemt */}
              <div className='space-y-6'>
                {activeSection.id === 'personal'&& (
                 <PersonalInfoForm data={resumedata.personal_info} onChange={(data)=>setresumedata(prev =>({...prev,personal_info:
                  data
                 }))} removeBackground={RemoveBackground} 
                 setRemoveBackground={setRemoveBackground}/>

                 
                )}
                {
                  activeSection.id === 'summary'&& (
                    <ProfessionalSummaryForm data={resumedata.professional_summary} onChange={(data)=>setresumedata(prev =>({...prev,professional_summary: data}))} setResumeData={setresumedata} />
                  )
                }

                  {
                  activeSection.id === 'experience'&& (
                    <ExperienceForm data={resumedata.experience} onChange={(data)=>setresumedata(prev =>({...prev,experience: data}))} />
                  )
                }

                
                  {
                  activeSection.id === 'education'&& (
                    <EducationForm data={resumedata.education} onChange={(data)=>setresumedata(prev =>({...prev,education: data}))} />
                  )
                }
                
                  {
                  activeSection.id === 'projects'&& (
                    <ProjectForm data={resumedata.projects || []} onChange={(data)=>setresumedata(prev =>({...prev,projects: data}))} />
                  )
                } 

                  {
                  activeSection.id === 'skills'&& (
                    <SkillsForms data={resumedata.skills || []} onChange={(data)=>setresumedata(prev =>({...prev,skills: data}))} />
                  )
                }

                
               
  
              </div>
              <button onClick={()=>{toast.promise(saveResume,{loading: 'Saving resume...'})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all '>
                Save Changes 
              </button>
              
            </div>

          </div>
          {/* right panel  preview*/}
          <div className='lg:col-span-7 max-lg:mt-6'>

              <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                  {resumedata.public&&(
                    <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs 
                    bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 
                    rounded-lg ring-blue-300 hover:ring transition-colors'>
                      <Share2Icon className='size-4' /> Share
                    </button>
                  )}
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs 
                    bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 
                    rounded-lg ring-blue-300 hover:ring transition-colors'>
                    {resumedata.public ? <EyeIcon className='size-4'/> : <EyeOffIcon className='size-4 text-gray-400'/>}
                     {resumedata.public ? 'public' : 'Private'}
                  </button>
                  <button  onClick={downloadResume}  className='flex items-center p-2 px-4 gap-2 text-xs 
                    bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 
                    rounded-lg ring-blue-300 hover:ring transition-colors'> 
                    <DownloadIcon className='size-4' /> Download
                    </button>

                </div>
              </div>

              {/* resume previwe */}
              <ResumePreview  data={resumedata} template={resumedata.template} 
              accentColor={resumedata.accent_color}/>
          </div>


        </div>


      </div>
    </div>
  )
}

export default Resumebuilder ;
