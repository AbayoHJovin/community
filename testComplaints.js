// Add test complaints\nconst addTestComplaints = async () => {\n  const testComplaints = [\n    {\n      id: 1001,\n      date: \
2024-06-15\,\n      day: \Saturday\,\n      time: \10:00
AM\,\n      title: \TEST:
Road
needs
repair\,\n      subtitle: \There
are
many
potholes
on
the
main
road\,\n      location: \Kigali
Center\,\n      backgroundImage: { uri: \https://picsum.photos/200\ },\n      leader: { name: \Steve
Bertin\, responsibilities: \Mayor\ },\n      category: \Infrastructure\,\n      status: \pending\,\n      userId: \test-user\,\n      createdBy: \Test
User\\n    },\n    {\n      id: 1002,\n      date: \2024-06-14\,\n      day: \Friday\,\n      time: \2:30
PM\,\n      title: \TEST:
Garbage
collection
issue\,\n      subtitle: \Garbage
has
not
been
collected
for
a
week\,\n      location: \Gasabo
District\,\n      backgroundImage: { uri: \https://picsum.photos/201\ },\n      leader: { name: \Steve
Bertin\, responsibilities: \Mayor\ },\n      category: \Sanitation\,\n      status: \in-progress\,\n      userId: \test-user\,\n      createdBy: \Test
User\\n    }\n  ];\n  \n  try {\n    // Save to AsyncStorage\n    await AsyncStorage.setItem(\userComplaints\, JSON.stringify(testComplaints));\n    console.log('Test complaints added to AsyncStorage');\n  } catch (error) {\n    console.error('Failed to add test complaints:', error);\n  }\n};
