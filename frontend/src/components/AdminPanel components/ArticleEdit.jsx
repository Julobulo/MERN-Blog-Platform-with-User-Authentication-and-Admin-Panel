import React, { useEffect, useState } from 'react';
import CreateForm from '../CreateForm';
import Spinner from '../Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ArticleEdit = () => {
    const { title } = useParams();
    // const [loading, setLoading] = useState(true);
    // const [articleData, setArticleData] = useState({});
    // useEffect(() => {
    //     setLoading(true);
    //     axios.get(`http://localhost:5555/blog/article/${title}`,
    //         { withCredentials: true })
    //         .then((response) => {
    //             setArticleData(response.data);
    //             const article = response.data;
    //             const { image: _, ...articleWithoutImage } = article; // Destructure to remove the "image" field
    //             console.log(`Here's the article data gotten: ${JSON.stringify(articleWithoutImage)}`);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             setLoading(false);
    //         })
    //     console.log(`Article data after axios: ${JSON.stringify(articleData)}`)
    // }, []);
    const [loading, setLoading] = useState(false);
    const [articleData, setArticleData] = useState(
        {
            image: "https://google.com/image",
            tags: ["test", "retest"],
            main: [
                {
                    "id": "10c15bef-5b69-4d91-b113-056ccf8666b3",
                    "type": "table",
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default"
                    },
                    "content": [{
                        "type": "tableContent",
                        "rows": [
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text",
                                            "text": "this",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "table",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "is",
                                            "styles": {}
                                        }
                                    ]
                                ]
                            },
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text",
                                            "text": "going",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "to",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "be",
                                            "styles": {}
                                        }
                                    ]
                                ]
                            },
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text",
                                            "text": "difficult",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "to",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text",
                                            "text": "display",
                                            "styles": {}
                                        }
                                    ]
                                ]
                            }
                        ]
                    }],
                    "children": []
                },
                {
                    "props": {
                        "textColor": "default",
                        "backgroundColor": "default"
                    },
                    "id": "10c15bef-5b69-4d91-b113-056ccf8666b3",
                    "type": "table",
                    "content": [{
                        "type": "tableContent",
                        "rows": [
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text",
                                            "text": "this",
                                            "_id": "6692d1e7dced7f68d80b0d77",
                                            "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "table", "_id": "6692d1e7dced7f68d80b0d78", "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "is", "_id": "6692d1e7dced7f68d80b0d79", "styles": {}
                                        }
                                    ]
                                ],
                                "_id": "6692d1e7dced7f68d80b0d76",
                                "styles": {}
                            },
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text", "text": "going", "_id": "6692d1e7dced7f68d80b0d7b", "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "to", "_id": "6692d1e7dced7f68d80b0d7c", "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "be", "_id": "6692d1e7dced7f68d80b0d7d", "styles": {}
                                        }
                                    ]
                                ],
                                "_id": "6692d1e7dced7f68d80b0d7a",
                                "styles": {}
                            },
                            {
                                "cells": [
                                    [
                                        {
                                            "type": "text", "text": "difficult", "_id": "6692d1e7dced7f68d80b0d7f", "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "to", "_id": "6692d1e7dced7f68d80b0d80", "styles": {}
                                        }
                                    ],
                                    [
                                        {
                                            "type": "text", "text": "display", "_id": "6692d1e7dced7f68d80b0d81", "styles": {}
                                        }
                                    ]
                                ],
                                "_id": "6692d1e7dced7f68d80b0d7e",
                                "styles": {}
                            },
                        ],
                        "_id": "6692d1e7dced7f68d80b0d75",
                        "styles": {}
                    }]
                    ,
                    "children": [],
                    "_id": "6692d1e7dced7f68d80b0d74"
                },
                // {
                //     "props": {
                //         "textColor": "default",
                //         "backgroundColor": "default"
                //     },
                //     "id": "10c15bef-5b69-4d91-b113-056ccf8666b3",
                //     "type": "table",
                //     "content": [
                //         {
                //             "type": "tableContent",
                //             "rows": [
                //                 {
                //                     "cells": [
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "this",
                //                                 "_id": "6692d1e7dced7f68d80b0d77"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "table",
                //                                 "_id": "6692d1e7dced7f68d80b0d78"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "is",
                //                                 "_id": "6692d1e7dced7f68d80b0d79"
                //                             }
                //                         ]
                //                     ],
                //                     "_id": "6692d1e7dced7f68d80b0d76"
                //                 },
                //                 {
                //                     "cells": [
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "going",
                //                                 "_id": "6692d1e7dced7f68d80b0d7b"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "to",
                //                                 "_id": "6692d1e7dced7f68d80b0d7c"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "be",
                //                                 "_id": "6692d1e7dced7f68d80b0d7d"
                //                             }
                //                         ]
                //                     ],
                //                     "_id": "6692d1e7dced7f68d80b0d7a"
                //                 },
                //                 {
                //                     "cells": [
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "difficult",
                //                                 "_id": "6692d1e7dced7f68d80b0d7f"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "to",
                //                                 "_id": "6692d1e7dced7f68d80b0d80"
                //                             }
                //                         ],
                //                         [
                //                             {
                //                                 "type": "text",
                //                                 "text": "display",
                //                                 "_id": "6692d1e7dced7f68d80b0d81"
                //                             }
                //                         ]
                //                     ],
                //                     "_id": "6692d1e7dced7f68d80b0d7e"
                //                 }
                //             ],
                //             "_id": "6692d1e7dced7f68d80b0d75"
                //         }
                //     ],
                //     "children": [],
                //     "_id": "6692d1e7dced7f68d80b0d74"
                // },
            ]
        });
    if (loading || !articleData) {
        return <Spinner />
    }
    else (
        console.log(`article data: ${JSON.stringify(articleData)}`)
    )
    return (
        <CreateForm
            pageTitle={'Edit'}
            articleData={articleData}
        />
        // <pre>
        //     {JSON.stringify(articleData.tags, null, "\t")}
        // </pre>
    );
};

export default ArticleEdit;
