class ApiFeatures{
    constructor(query, queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{

        }
        this.query=this.query.find({...keyword});
        return this
    }

    filter(){
        let queryCopy={ ...this.queryStr };
        const deleteItems=["keyword", "page", "limit"]
        deleteItems.forEach((key)=>{
            delete queryCopy[key];
        })

        queryCopy=JSON.stringify(queryCopy);
        queryCopy=queryCopy.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        console.log(queryCopy);
        this.query=this.query.find(JSON.parse(queryCopy));
        return this;
    }

    pagination(resultPP){
        const currentpage=Number(this.queryStr.page) || 1;
        const skip = resultPP * (currentpage - 1);
        this.query=this.query.limit(resultPP).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;