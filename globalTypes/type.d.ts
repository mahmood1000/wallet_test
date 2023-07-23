
interface ValidationError extends Error {
	details: { message: string }[];
}
