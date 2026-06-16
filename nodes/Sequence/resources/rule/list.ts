import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit } from '../shared';

const show = { operation: ['list'], resource: ['rule'] };

export const ruleListDescription: INodeProperties[] = [...returnAllAndLimit(show)];
