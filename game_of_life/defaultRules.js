var globalRules = {

    "🐮": {
        birth: {atom: {eq: 3, neighbour: "🐮"}},
        death: {or: [
            {atom: {max: 1, neighbour: "🐮"}},
            {atom: {min: 4, neighbour: "🐮"}}
        ]}
    }

};


var globalCheckingFuncs = {};