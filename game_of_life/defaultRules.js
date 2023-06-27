var globalRules = {

    "🐮": {
        birth: {atom: {eq: 3, neighbour: "🐮"}},
        death: {or: [
            {atom: {max: 1, neighbour: "🐮"}},
            {atom: {min: 4, neighbour: "🐮"}}
        ]}
    },

    "🐸": {
        birth: {or: [
            {atom: {between: [2, 5], neighbour: "🐸"}},
            {and: [
                {atom: {eq: 1, neighbour: "💧"}},
                {atom: {eq: 1, neighbour: "🪵"}}
            ]}
        ]},
        death: {atom: {min: 6, neighbour: "🐸"}}
    }

};


var globalCheckingFuncs = {};