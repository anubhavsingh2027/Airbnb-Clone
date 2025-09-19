exports.errorpage=(req,res,next)=>{
  res.status(404).render('404',{pagetitle:'Error'});

}