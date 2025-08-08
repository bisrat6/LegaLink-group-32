const fs = require("fs");
const cases= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/cases.json`));

exports.getAllCases= (req,res)=>{
    console.log(req.requestTime);
    res.status(200).json({
        time:req.requestTime,
        status:"success",
        results:cases.length,
        data:{
            cases
        }
    });
};

exports.postCase= (req,res)=>{
    const newCase= Object.assign({id:cases[cases.length-1].id+1},req.body);
    cases.push(newCase);
    fs.writeFile(`${__dirname}/dev-data/cases.json`,JSON.stringify(cases),error=>{
        res.status(201).json({status:"Success",case:newCase});
    });
};

exports.updateCase= (req,res)=>{
    res.status(200).json({
        status:"success",
        message:"Successfully Updated"
    });
};

exports.getCase=(req,res)=>{
    const id=parseInt(req.params.id);
    const post=cases.find((post)=> post.id===id);
    res.status(200).json(post);
};

exports.deleteCase= (req,res)=>{
    const id=req.params.id *1;
    const index=cases.findIndex(Case=>Case.id===id);
    const deletedCase=cases[index];
    cases.splice(index,1);

    res.status(204).json({
        status:"success",
        message:"Successfully deleted!",
        data:{
            deletedCase
        }
    });
};
