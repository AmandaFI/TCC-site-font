import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3000/api/";
axios.defaults.baseURL = "https://infinite-citadel-83075-194be0dadd42.herokuapp.com/api/";

export type subjectType = {
	id: number;
	email: string;
	score?: number;
};

export type postSubject = Omit<subjectType, "id">;

export type labelType = "H" | "G";

export type newsArticleType = {
	id: number;
	content: string;
	label: labelType;
	originSite: string;
};

export const getNewsArticle = (id: number) => axios.get<newsArticleType>(`new_article/${id}`);
export const getRandomNewsArticles = (quantity: number) =>
	axios.get<Array<newsArticleType>>(`news_article/get_random_news_articles?quantity=${quantity}`);

export const registerSubject = (email: string, score: number) => axios.post<subjectType>("subject", { email, score });
export const checkEmail = (email: string) => axios.post<subjectType>("subject/check_email", { email });
