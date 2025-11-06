import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {accountGroupService, AccountGroup} from '../../services/accountGroupService';
import EmptyState from '../../components/EmptyState';

export default function AccountGroupsScreen({navigation}: any) {
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await accountGroupService.getAll();
      setGroups(data || []);
    } catch (error: any) {
      console.error('Failed to load account groups:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load account groups');
      setGroups([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderGroup = ({item}: {item: AccountGroup}) => (
    <View style={styles.groupCard}>
      <View style={[styles.groupIcon, {backgroundColor: item.color}]}>
        <Text style={styles.iconText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Account Groups</Text>
        <View style={{width: 60}} />
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadGroups} />
        }
        contentContainerStyle={[
          styles.list,
          groups.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="📁"
              title="No Account Groups Yet"
              message="Create account groups to organize your accounts!"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  list: {
    padding: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});

