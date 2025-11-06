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
import {categoryService, Category} from '../../services/categoryService';
import EmptyState from '../../components/EmptyState';

export default function CategoriesScreen({navigation}: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete ${category.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await categoryService.delete(category.id);
              loadCategories();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ],
    );
  };

  const renderCategory = ({item}: {item: Category}) => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        style={styles.categoryContent}
        onPress={() => navigation.navigate('EditCategory', {categoryId: item.id})}>
        <View style={[styles.categoryIcon, {backgroundColor: item.color}]}>
          <Text style={styles.iconText}>{item.icon || item.name.charAt(0)}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryType}>{item.type}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
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
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateCategory')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadCategories} />
        }
        contentContainerStyle={[
          styles.list,
          categories.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="🏷️"
              title="No Categories Yet"
              message="Create categories to organize your income and expenses!"
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
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  categoryType: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
  },
});

