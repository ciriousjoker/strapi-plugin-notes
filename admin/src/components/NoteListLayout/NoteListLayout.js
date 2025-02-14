import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Box, Divider, Typography, Button, Stack, Loader } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { getTrad } from '../../utils';
import { useNote } from '../../hooks/useNote';
import NoteModal from '../NoteModal';
import NoteListItem from '../NoteListItem';

const NoteListLayout = () => {
	const { isCreatingEntry, modifiedData, slug } = useCMEditViewDataManager();
	const { getNotes } = useNote();
	const { formatMessage } = useIntl();
	const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
	const [activeNote, setActiveNote] = useState({});
	const [notes, setNotes] = useState([]);

	if (isCreatingEntry) {
		return null;
	}

	const id = modifiedData.id || false;
	if (!id) {
		return null;
	}

	const entity = { id, slug };

	const { isLoading, data, isRefetching } = getNotes({
		filters: {
			entityId: entity.id,
			entitySlug: entity.slug,
		},
		sort: { createdAt: 'ASC' },
	});

	// set initial data to state so its reactive
	useEffect(() => {
		if (!isLoading && !isRefetching) {
			if (data.length) {
				setNotes([...data]);
			} else {
				setNotes([]);
			}
		}
	}, [isLoading, isRefetching]);

	return (
		<Box paddingTop={8}>
			<Typography variant="sigma" textColor="neutral600">
				{formatMessage({
					id: getTrad('plugin.name'),
					defaultMessage: 'Notes',
				})}
			</Typography>
			<Box marginTop={2} marginBottom={4}>
				<Divider />
			</Box>
			{isLoading ? (
				<Loader small>
					{formatMessage({
						id: getTrad('notes.loading'),
						defaultMessage: 'Loading Content ...',
					})}
				</Loader>
			) : (
				<Stack spacing={2} style={{ maxHeight: '150px', overflowY: 'auto', overflowX: 'hidden' }}>
					{!isLoading &&
						notes.map((note) => (
							<NoteListItem
								key={note.id}
								note={note}
								setActiveNote={setActiveNote}
								toggleModal={setIsNoteModalVisible}
							/>
						))}
				</Stack>
			)}
			<Button
				fullWidth
				variant="default"
				label="Notes"
				startIcon={<Plus />}
				disabled={isLoading}
				onClick={() => {
					setActiveNote({});
					setIsNoteModalVisible(true);
				}}
				marginTop={4}
			>
				Add a note
			</Button>
			{isNoteModalVisible && (
				<NoteModal
					entity={entity}
					note={activeNote}
					setIsNoteModalVisible={setIsNoteModalVisible}
				/>
			)}
		</Box>
	);
};

export default NoteListLayout;
