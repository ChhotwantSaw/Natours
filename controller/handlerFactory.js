const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError')
const API=require('./../utils/APIFeatures');

exports.deleteOne=Model=>catchAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc) next(new AppError("No document found!"));
    res.status(204).json({
        status:"Success",
        data:null
    })

});

exports.createOne= Model =>catchAsync(async(req,res,next)=>{

    const doc=await Model.create(req.body);
    res.status(201).json({
    status:'Success',
    data:doc
})
});

exports.updateOne=Model=>catchAsync( async(req,res,next)=>{
        const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
        });
        if(!doc) next(new AppError("No document found!"));
        res.status(201).json({
            status:"Success",
            data:{
                doc
            }    
        })
})

exports.getOne=(Model,popOptions)=>catchAsync(async (req,res,next)=>{
        let query;
         query= Model.findById(req.params.id);
        if(!query){
            return next(new appError("No doc Found",404));
        }
        if(popOptions) query.populate(popOptions);
        const doc=await query;
        res.status(200).json(
            {
            status:"success",
            data:{
                doc
            }
            }
    
        );
    });

    exports.getAll=Model=> catchAsync(async (req,res,next)=>{
        //For nested routes
        let filter={}
        if(req.params.tourId) filter={tour:req.params.tourId};
        // console.log(req.params.id)
        const features=new API(Model.find(filter),req.query).filter().sort().fieldLimit().pagination();
        // const doc= await features.query.explain();        
        const doc= await features.query;        
        res.status(200).json(
            {
            status:"success",
            length:doc.length,
            data:doc
            }

        );
    })


