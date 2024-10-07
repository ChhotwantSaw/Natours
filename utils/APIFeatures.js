class API{

    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    filter(){
        const queryObj={...this.queryStr};

         //Filtering
        const excludedFields=['limit','sort','page','fields'];
        excludedFields.forEach(el=> delete queryObj[el]);

        //Advance Filtering
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g, el=> `$${el}`);
        this.query=  this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort(){
         if(this.queryStr.sort){   
            this.query= this.query.sort(this.queryStr.sort.split(',').join(' '));
        }
        else{
            this.query=this.query.sort('-createdAt');
        }
        return this;
    }

    fieldLimit(){
        if(this.queryStr.fields){
            this.query=this.query.select(this.queryStr.fields.split(',').join(' '));
        }
        else{
            this.query=this.query.select('-__v');
        }
        return this;
    }

    pagination(){
         const skip=this.queryStr.page?this.queryStr.page*1:1;
        const limit=this.queryStr.limit?this.queryStr.limit*1:100;
        this.query=this.query.skip(skip-1).limit(limit);
        return this;
    }

}
module.exports=API;