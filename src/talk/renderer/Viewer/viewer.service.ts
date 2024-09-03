/*
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { davGetClient, davRemoteURL, davRootPath } from '@nextcloud/files'
import type { FileStat } from 'webdav' // eslint-disable-line n/no-extraneous-import -- not exported from @nextcloud/files

export async function fetchFileContent(filename: string, format: 'text'): Promise<string>
export async function fetchFileContent(filename: string, format: 'binary'): Promise<Blob>
/**
 * Fetch file content
 * @param filename - Path to user's file, e.g. '/Talk/file.txt'
 * @param format - Format of the file content to be returned. 'binary' is returned as Blob
 */
export async function fetchFileContent(filename: string, format: 'text' | 'binary'): Promise<string | Blob> {
	const webDavClient = davGetClient(davRemoteURL + davRootPath)

	// Get the MIME type of the file for the binary file to generate a correct Blob later
	let mimeType: string
	if (format === 'binary') {
		const stat = await webDavClient.stat(filename) as FileStat
		mimeType = stat.mime
	}

	// Fetch file content
	type FileContent = typeof format extends 'binary' ? ArrayBuffer : string
	const content = await webDavClient.getFileContents(filename, { format }) as FileContent

	// Return the content in the requested format
	return format === 'binary' ? new Blob([content], { type: mimeType }) : content
}
