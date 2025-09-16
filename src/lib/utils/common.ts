import { DateFormatter } from '@internationalized/date';

export const dateFormatter = new DateFormatter('en-US', {
	dateStyle: 'long'
});

export const formatDate = (date: Date | string) => dateFormatter.format(new Date(date));
