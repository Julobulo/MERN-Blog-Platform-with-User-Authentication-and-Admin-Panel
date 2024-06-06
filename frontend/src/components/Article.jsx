import React from "react";
import ArticleCard from "./ArticleCard";


const App = () => {
    return (
        <div className="bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Article
                        title="The Rise of Artificial Intelligence in Modern Society"
                        content={articleContent}
                        imgSrc="https://via.placeholder.com/800x400"
                        relatedArticles={relatedArticles}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;


const Article = ({ title, content, imgSrc, relatedArticles }) => {
    return (
        <div className="p-6 mb-8 bg-gray-900 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-green-400">{title}</h1>
            <img
                alt={title}
                src={imgSrc}
                className="mb-5 w-full rounded-xl bg-no-repeat object-cover object-center"
            />
            <div className="text-gray-300">
                {content}
            </div>
            <hr className="my-6 border-t border-gray-700" />
            <h2 className="text-2xl font-bold mb-4 text-green-400">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((article, index) => (
                    <ArticleCard
                        key={index}
                        title={article.title}
                        description={article.description}
                        href={article.href}
                        author={article.author}
                        date={article.date}
                        tags={article.tags}
                        imgSrc={article.imgSrc}
                        hearts={article.hearts}
                    />
                ))}
            </div>
        </div>
    );
};

const articleContent = (
    <>
        <p>
            The intersection of technology and daily life has never been more profound. As we navigate through the
            intricacies of the 21st century, our reliance on technological advancements becomes increasingly apparent.
            From smartphones that serve as our personal assistants to AI-driven algorithms that personalize our online
            experiences, the digital age has transformed the way we live, work, and communicate.
        </p>
        <p>
            One of the most significant developments in recent years is the rise of artificial intelligence (AI). AI is
            no longer a concept confined to science fiction; it is now an integral part of our daily routines. AI-powered
            virtual assistants like Siri, Alexa, and Google Assistant have made it easier for us to manage our tasks, find
            information, and even control smart home devices. These assistants leverage natural language processing and
            machine learning to understand and respond to our queries, making our interactions with technology more
            intuitive and efficient.
        </p>
        <h2 className="text-xl font-bold mt-4 mb-2 text-green-400">The Impact of AI on Various Industries</h2>
        <p>
            The impact of AI extends beyond personal use; it is revolutionizing industries across the board. In healthcare,
            AI is being used to develop advanced diagnostic tools, predict patient outcomes, and personalize treatment
            plans. For instance, machine learning algorithms can analyze medical images to detect early signs of diseases
            like cancer, often with greater accuracy than human doctors.
        </p>
        <p>
            In the financial sector, AI-driven analytics are helping institutions detect fraudulent activities, assess
            credit risks, and provide personalized financial advice. By analyzing vast amounts of data, AI systems can
            identify patterns and trends that would be impossible for humans to discern. This not only enhances security
            but also enables more informed decision-making.
        </p>
        <h2 className="text-xl font-bold mt-4 mb-2 text-green-400">Challenges and Ethical Considerations</h2>
        <p>
            Despite its numerous benefits, the proliferation of AI also raises important ethical and societal questions.
            Issues such as data privacy, algorithmic bias, and the displacement of jobs due to automation are at the
            forefront of the AI debate. As AI systems become more advanced, ensuring that they are developed and used
            responsibly becomes paramount.
        </p>
        <p>
            Data privacy is a major concern, as AI systems often require large datasets to function effectively. The
            collection and use of personal data must be handled with care to protect individuals' privacy rights. Moreover,
            transparency in how AI algorithms operate is essential to prevent biases that can lead to unfair treatment or
            discrimination.
        </p>
        <h2 className="text-xl font-bold mt-4 mb-2 text-green-400">The Future of AI</h2>
        <p>
            Looking ahead, the future of AI holds immense potential. Advances in areas such as quantum computing, neural
            networks, and deep learning are poised to further expand the capabilities of AI. We can expect AI to play an
            even greater role in fields like autonomous transportation, climate modeling, and personalized education.
        </p>
        <p>
            As AI continues to evolve, it will be crucial for policymakers, technologists, and society at large to work
            together to address the challenges and maximize the benefits. By fostering a collaborative approach, we can
            ensure that AI serves as a force for good, driving innovation and improving lives around the world.
        </p>
    </>
);

const relatedArticles = [
    {
        title: "The Future of AI in Healthcare",
        description: "Explore how AI is transforming the healthcare industry, from diagnostics to treatment.",
        href: "#",
        author: "Jane Doe",
        date: "June 1, 2024",
        tags: ["AI", "Healthcare"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 120
    },
    {
        title: "AI and Financial Services",
        description: "Discover the ways AI is revolutionizing the financial sector and enhancing security.",
        href: "#",
        author: "John Smith",
        date: "May 20, 2024",
        tags: ["AI", "Finance"],
        imgSrc: "https://via.placeholder.com/300",
        hearts: 98
    }
];
